import 'mapbox-gl/dist/mapbox-gl.css';
import React, {
    useRef,
    useEffect,
    useState,
    useCallback,
    useMemo,
    createContext,
    useContext,
} from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import Map, { Source, Layer } from 'react-map-gl';
import styles from './../../styles/MapBox.module.css';
import stylesObject from './mapStyles';
import useWindowSize from './../../hooks/useWindowSize';
import useMapView from './../../hooks/useMapView';
import ToolTip from './popup/tooltip';
import { SectionContext } from './../../pages';

mapboxgl.accessToken =
    'pk.eyJ1IjoibWl0Y2l2aWNkYXRhIiwiYSI6ImNpbDQ0aGR0djN3MGl1bWtzaDZrajdzb28ifQ.quOF41LsLB5FdjnGLwbrrg';

export const ScreenContext = createContext({
    pointerCoords: { posX: 0, posY: 0 },
    setCoordinates: (() => { }),
    containerDimensions: { width: 0, height: 0 },
    setDimensions: (() => { }),
    mapCenter: {
        lng: -10,
        lat: 20,
    }
})

function keys(object) {
    return Object.keys(object)
}
function values(object) {
    return Object.values(object)
}

function objectMap(object, mapFn) {
    if (object) {
        return Object.keys(object).reduce(function (result, key) {
            result[key] = mapFn(object[key])
            return result
        }, {})
    }
}


export default function MapBox({ activeSource, narrativeData, cityData, toggleMap }) {
    const containerRef = useRef(null)
    const mapRef = useRef(null)
    const { width } = useWindowSize()
    const [mapStyle, setMapStyle] = useState('mapbox://styles/mitcivicdata/cld132ji3001h01rn1jxjlyt4')
    const { zoom, lng, lat } = useMapView()
    const mapCenter = { lng: lng, lat: lat, }
    const [tooltipInfo, setTooltipInfo] = useState({
        migrantData: narrativeData && narrativeData.migrantData,
        cityData: cityData
    });

    const [pointerCoords, setCoordinates] = useState({ posX: 0, posY: 0 })
    let getMousePos = (event) => setCoordinates({ posX: event.pageX, posY: event.pageY })
    const [containerDimensions, setDimensions] = useState({ width: 0, height: 0 })
    const pointerPosValue = { pointerCoords, setCoordinates, containerDimensions, setDimensions, mapCenter }

    const { layersObject, highlightLayer } = stylesObject(activeSource)
    const { currentSection, setSection } = useContext(SectionContext)
    const [overlayOpacity, setOverlayOpacity] = useState(0)
    const [featureOpacity, setFeatureOpacity] = useState({
        countryBorder: 1,
        originCities: 0,
        transect: 0,
        countryOverlay: 0,

    })

    function renderSource(activeSource, data) {
        const sourceInfo = data.sources;
        if (sourceInfo)
            return (
                <>
                    {sourceInfo.map((source) => {
                        return <Source id={source.id} type="vector" url={source.url} key={source.id} />;
                    })}
                </>
            );
    }

    const onInfo = useCallback((event) => {
        const region = event.features && event.features[0];
        let routeIndex = region && region.properties.segement_i
        let routeId = region && region.properties.segement_i
        let migrantCountryName = region && region.properties.COUNTRY

        if (routeIndex > 6) routeIndex = 6
        if (routeId > 6) routeId = 6
        if (migrantCountryName === "Libya") routeIndex = 7

        const riskTypes = [
            { "Reported Violence": "risk_4mi" },
            { "Conflict Events": "risk_acled" },
            { "Food Insecurity": "risk_food" },
            { "Reliance on Smugglers": "Risk_smugg" },
            { "Remoteness": "risk_remot" },
            { "Heat Exposure": "risk_heat" },
        ]
        const transectRiskData = {
            risks: riskTypes.map((risk, index) => {
                const names = riskTypes.map(obj => keys(obj)[0])
                const riskProperties = riskTypes.map(obj => values(obj)[0])
                const riskLevel = region && region.properties[riskProperties[index]]
                return { name: names[index], riskLevel: riskLevel }
            }),
            totalRisk: region && region.properties.risks_tota,
            routeId: region && region.properties.segement_i
        }
        setSection({
            index: routeIndex,
            routeId: routeId
        });

        // Data Properties that will be supplied to tooltips when map layer features are hovered
        setTooltipInfo({
            ...tooltipInfo,
            longitude: event.lngLat.lng,
            latitude: event.lngLat.lat,
            hoveredMigrantCountry: (region && region.properties.country_origin) || migrantCountryName,
            hoveredNonMigrantCountry: (region && region.properties.name_en) || migrantCountryName,
            hoveredCity: region && region.properties.city_origin,
            migrantCount: region && region.properties.count,
            riskLevelData: transectRiskData,
            routeId: routeId
        })
    }, [activeSource]);


    // Features (geographical area) of the map that are currently being hovered over
    const [
        hoveredMigrantCountry,
        hoveredNonMigrantCountry,
        hoveredCity,
        hoveredRouteId
    ] = [
        "hoveredMigrantCountry",
        "hoveredNonMigrantCountry",
        "hoveredCity",
        "routeId"
    ].map(hoveredProperty => {
        return tooltipInfo && tooltipInfo[hoveredProperty] || ''
    })
    const filter = useMemo(() => ['in', 'COUNTRY', hoveredMigrantCountry], [hoveredMigrantCountry]);
    const nonMigrantCountryFilter = useMemo(() => ['in', 'name_en',
        (hoveredNonMigrantCountry) === "Côte d'Ivoire" ? "Ivory Coast" : (hoveredNonMigrantCountry)
    ], [hoveredNonMigrantCountry]);
    const citiesSelectedCountryFilter = useMemo(() => ['in', 'country_origin',
        (hoveredMigrantCountry) == "Côte d'Ivoire" ? "Côt" :
            (hoveredMigrantCountry) == "Burkina Faso" ? "Burkin" :
                (hoveredMigrantCountry) == "Sierra Leone" ? "Sierr" :
                    hoveredMigrantCountry],
        [hoveredMigrantCountry]);
    const unselectedCountryFilter = useMemo(() => [
        "match",
        ["get", "name_en"],
        [hoveredMigrantCountry != "Côte d'Ivoire" ? hoveredMigrantCountry : 'Ivory Coast'],
        false,
        true
    ], [hoveredMigrantCountry]);
    const cityHighlightFilter = useMemo(() => ['in', 'city_origin', hoveredCity], [hoveredCity]);
    const routeFilter = useMemo(() => ['in', 'index', String(hoveredRouteId)], [hoveredRouteId]);
    const [countryTip, cityTip, routeTip] = ["country", "city", "route"].map(type => {
        return (
            <ToolTip
                key={type}
                location={{ longitude: tooltipInfo.longitude, latitude: tooltipInfo.latitude }}
                toolType={type}
                regionDataProps={tooltipInfo}

            />
        )
    })

    useEffect(() => {
        setDimensions({ width: containerRef.current.offsetWidth, height: containerRef.current.offsetHeight })
    }, [containerRef])

    useEffect(() => {
        if (hoveredMigrantCountry) setOverlayOpacity(0.35)
        else setOverlayOpacity(0)
    }, [hoveredMigrantCountry])

    useEffect(() => {
        const opacitySwicth = {
            "overallRoutes": { ...objectMap(featureOpacity, () => 0), countryBorder: 1 },
            "originCities": { ...objectMap(featureOpacity, () => 1), transect: 0, allCities: 0 },
            "transectSegment": { ...objectMap(featureOpacity, () => 0), transect: 1 },
            "globeView": { ...objectMap(featureOpacity, () => 0) },
            "null": featureOpacity,
            "undefined": featureOpacity
        }
        if (typeof featureOpacity === "object") setFeatureOpacity(opacitySwicth[activeSource])

        if (mapRef.current) {
            mapRef.current.on('load', () => {
                mapRef.current.resize()
            })
            if (activeSource === "transectSegment") {
                mapRef.current.getMap().setLayoutProperty("wa-ifpri-countries-outline", "visibility", "none")
                mapRef.current.getMap().setLayoutProperty("libya-outline", "visibility", "none")
                mapRef.current.getMap().setLayoutProperty("transect-countries-outline", "visibility", "visible")
            } else {
                mapRef.current.getMap().setLayoutProperty("wa-ifpri-countries-outline", "visibility", "visible")
                mapRef.current.getMap().setLayoutProperty("libya-outline", "visibility", "visible")
                mapRef.current.getMap().setLayoutProperty("transect-countries-outline", "visibility", "none")
            }

            mapRef.current.on('click', 'migration', (e) => {
                if (activeSource === "globeView") {
                    const globeElem = document.getElementById("globeView")
                    globeElem.scrollIntoView()
                    toggleMap()
                }
            })
        }
    }, [activeSource])

    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.on('load', () => {
                mapRef.current.getMap().setLayoutProperty("wa-ifpri-countries-outline", "visibility", "visible")
                mapRef.current.getMap().setLayoutProperty("libya-outline", "visibility", "visible")
            })
        }
    })
    return (
        <ScreenContext.Provider value={pointerPosValue}>
            <div className={styles.mapContainer}
                onMouseMove={getMousePos}
                ref={containerRef}
            >
                <Map
                    initialViewState={{
                        longitude: lng,
                        latitude: lat,
                        zoom: zoom
                    }}
                    latitude={lat}
                    longitude={lng}
                    style={{
                        width: '100%', height: '100%'
                    }}
                    attributionControl={false}
                    interactiveLayerIds={
                        activeSource === "originCities" ? ["hoverable", "cities", "overlay", "migration-buffer"] :
                            activeSource === "transectSegment" ? ["migration-buffer", "hoverable", 'overlay', "cities"] :
                                activeSource ? ["hoverable", "overlay", "cities", "migration-buffer"] : ['hoverable']}
                    zoom={zoom}
                    mapStyle={mapStyle}
                    ref={mapRef}
                    doubleClickZoom={false}
                    onMouseMove={onInfo}
                    dragPan={false}
                    dragRotate={false}
                    scrollZoom={false}
                // logoPosition='top-right'
                >
                    {(hoveredMigrantCountry && !hoveredCity) && (countryTip)}
                    {(hoveredCity) && (cityTip)}
                    {(hoveredRouteId) && (routeTip)}
                    {renderSource(activeSource, narrativeData)}

                    <Layer {...layersObject["unselectedCountryOverlay"]}
                        filter={unselectedCountryFilter}
                        paint={{
                            ...layersObject["unselectedCountryOverlay"].paint,
                            "fill-opacity": overlayOpacity
                        }}
                    />
                    <Layer {...layersObject["countryLayer"]} />

                    <Layer {...highlightLayer} filter={filter} />
                    {<Layer {...layersObject["overallRoutes"]}
                        paint={{
                            ...layersObject["overallRoutes"].paint,
                            "line-opacity": featureOpacity && featureOpacity.countryBorder,
                        }}
                    />}

                    <Layer {...layersObject["migrationRouteStyle"]}
                        lineJoin="round"
                        paint={{
                            ...layersObject["migrationRouteStyle"].paint,
                            // "line-opacity": featureOpacity && featureOpacity.transect,

                        }}
                    />
                    <Layer {...layersObject["migrationHover"]}
                        lineJoin="round"
                        filter={routeFilter}
                        paint={{
                            ...layersObject["migrationHover"].paint,
                            // "line-opacity": featureOpacity && featureOpacity.transect,

                        }}
                    />
                    <Layer {...layersObject["cityStyle"]}
                        paint={{
                            ...layersObject["cityStyle"].paint,
                            "circle-opacity": featureOpacity && featureOpacity.originCities,

                        }} />
                    <Layer {...layersObject["cityStyle"]}
                        id='cities-in-country'
                        filter={citiesSelectedCountryFilter}
                    />
                    <Layer {...layersObject["cityMarkerHighlight"]} filter={cityHighlightFilter} />
                    <Layer {...layersObject["migrationBuffer"]} />
                    {activeSource === "overallRoutes" && (<Layer {...layersObject["citiesContextAllMarker"]} />)}
                    {activeSource === "overallRoutes" && (<Layer {...layersObject["citiesContextAllLabel"]} />)}
                    {activeSource === "transectSegment" && (<Layer {...layersObject["citiesContextTransectMarker"]} />)}
                    {activeSource === "transectSegment" && (<Layer {...layersObject["citiesContextTransectLabel"]} />)}

                    {activeSource && (<Layer {...layersObject["migrationHover"]} lineJoin="round" filter={routeFilter} />)}
                    <Layer {...layersObject["destinationCitiesMarker"]} />
                    <Layer {...layersObject["destinationCitiesLabel"]} />

                    {width > 600 && (
                        <Layer {...layersObject["majorCountryLabel"]}
                            paint={{
                                ...layersObject["majorCountryLabel"].paint,
                                "text-opacity": featureOpacity && featureOpacity.countryBorder,

                            }}
                        />)}
                    {width > 600 && (
                        <Layer {...layersObject["minorCountryLabel"]}
                            paint={{
                                ...layersObject["minorCountryLabel"].paint,
                                "text-opacity": featureOpacity && featureOpacity.countryBorder,

                            }}
                        />)}
                    {(width > 600 && (!hoveredMigrantCountry || (activeSource === 'transectSegment'))) && (

                        <Layer {...layersObject["nonMigrantCountryLabel"]}
                            filter={nonMigrantCountryFilter}
                        />)}
                    {activeSource === "transectSegment" && (<Layer {...layersObject["transectCountryLabel"]} />)}
                </Map>
            </div >
        </ScreenContext.Provider>
    )
}
