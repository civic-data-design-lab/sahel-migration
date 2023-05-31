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
import ToolTip from './popup/tooltip';
import { SectionContext } from './../../pages';

mapboxgl.accessToken =
    'pk.eyJ1IjoibWl0Y2l2aWNkYXRhIiwiYSI6ImNpbDQ0aGR0djN3MGl1bWtzaDZrajdzb28ifQ.quOF41LsLB5FdjnGLwbrrg';

export const RouteContext = createContext({
    feature: null,
    point: null,
    setFeature: () => { },
    setPoint: () => { },
});

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

function zoomFunction(number) {
    const x = number / 100;
    // return 3.8 + 0.4 * Math.tanh((x - 8.5) / 1.5) + 0.3 * Math.tanh((x - 12.5) / 2.5) + 0.3 * Math.exp(-((x - 19) ** 2) / 2)
    // return -(1 / (2.5 * (Math.E ** ((number / 100 - 7) ** 2)))) + 3.7
    // if (x <= 6) return 3.5
    // if (6 <= x <= 19) return 3.26923076923 + 0.038461538461 * x
    // return 4
    return 0.0801143 * x + 2.72143;
}
function latFunction(number) {
    // return ((-3 / (2.5 * (Math.E ** ((number * 2 / 100 - 14) ** 2)))) + 2) * 10
    return 20;
}

function lngFunction(number) {
    const x = number / 100;
    return -0.727878 * x + 5.73398;
    // if (x === 900) return -3
    // return -0.765517 * x + 6.60345
    // const exponent = -(number * 2.5 / 100 - 20)
    // return 5 - (15 / (1 + Math.E ** exponent))
}

function computePerspective(width) {
    return { zoom: zoomFunction(width), lat: latFunction(width), lng: lngFunction(width) };
}

export default function MapBox({ activeSource, risks, cityData, toggleMap }) {
    const { width } = useWindowSize()
    const [mapStyle, setMapStyle] = useState('mapbox://styles/mitcivicdata/cld132ji3001h01rn1jxjlyt4')
    const [hoverInfo, setHoverInfo] = useState(null);
    const [cityInfo, setCityInfo] = useState(null);
    const [pointerCoords, setCoordinates] = useState({ posX: 0, posY: 0 })
    const [containerDimensions, setDimensions] = useState({ width: 0, height: 0 })
    const [routeInfo, setRouteInfo] = useState(null);
    const [feature, setFeature] = useState(null)
    const [point, setPoint] = useState(null)
    const routeValue = { feature, point, setFeature, setPoint }

    const { layersObject, highlightLayer } = stylesObject(activeSource)
    const { currentSection, setSection } = useContext(SectionContext)
    const [overlayOpacity, setOverlayOpacity] = useState(0)
    const [featureOpacity, setFeatureOpacity] = useState({
        countryBorder: 1,
        originCities: 0,
        transect: 0,
        countryOverlay: 0

    })

    let getMousePos = (event) => {
        setCoordinates({ posX: event.pageX, posY: event.pageY })
    };
    const mapRef = useRef(null)
    const containerRef = useRef(null)

    const perspective = useMemo(() => computePerspective(width), [width])
    const mapCenter = {
        lng: perspective.lng,
        lat: perspective.lat,
    }
    const pointerPosValue = { pointerCoords, setCoordinates, containerDimensions, setDimensions, mapCenter }


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
            index: region && region.properties.segement_i,
            routeId: region && region.properties.segement_i,
        });

        setRouteInfo({
            longitude: event.lngLat.lng,
            latitude: event.lngLat.lat,
            ...transectRiskData
        });
        setCityInfo({
            longitude: event.lngLat.lng,
            latitude: event.lngLat.lat,
            cityName: region && region.properties.city_origin,
            countryName: region && region.properties.country_origin,
            migrantCount: region && region.properties.count,
        });

        setHoverInfo({
            longitude: event.lngLat.lng,
            latitude: event.lngLat.lat,
            migrantCountryName: region && region.properties.COUNTRY,
            nonMigrantCountryName: region && region.properties.name_en,
        });
    }, []);

    const selectedCountry = (hoverInfo && hoverInfo.migrantCountryName) || '';
    const nonMigrantCountry = (hoverInfo && hoverInfo.nonMigrantCountryName) || '';
    const selectedCity = (cityInfo && cityInfo.cityName) || '';
    const selectedSegment = (currentSection && currentSection.routeId) || '';
    const countryNames = !selectedCountry
        ? []
        : ['Ghana', 'Mali', 'Nigeria', 'Niger', 'Chad'].filter((elem) => {
            return elem !== selectedCountry;
        });
    const filter = useMemo(() => ['in', 'COUNTRY', selectedCountry], [selectedCountry]);
    const unselectedCountryFilter = useMemo(() => [
        "match",
        ["get", "name_en"],
        [selectedCountry != "Côte d'Ivoire" ? selectedCountry : 'Ivory Coast'],
        false,
        true
    ], [selectedCountry]);
    const cityHighlightFilter = useMemo(() => ['in', 'city_origin', selectedCity], [selectedCity]);
    const highlightFilter = useMemo(
        () => ['in', ['get', 'ADM0_NAME'], ['literal', countryNames]],
        [selectedCountry]
    );
    const routeFilter = useMemo(() => ['in', 'SEGMENT_ID', selectedSegment], [selectedSegment]);

    const countryToolTipData = {
        ...hoverInfo,
        type: "country",
        cityData: cityData,
        migrantData: risks && risks.migrantData,
        selectedCountry: selectedCountry,
    }
    const nonMigrantCountryData = {
        ...hoverInfo,
        type: nonMigrantCountry,
    }
    const cityToolTipData = {
        ...cityInfo,
        type: "city",
        migrantData: risks && risks.migrantData,
        selectedCity: selectedCity,
    }
    const routeToolTipData = {
        ...routeInfo,
        type: "route",
        selectedSegment: selectedSegment,
        riskLevels: routeInfo
    }

    const [countryTip, nonMigrantCountryTip, cityTip, routeTip] = [countryToolTipData, nonMigrantCountryData, cityToolTipData, routeToolTipData].map(data => {
        return (
            <ToolTip
                key={data.type}
                location={{ longitude: data.longitude, latitude: data.latitude }}
                toolType={data.type}
                regionDataProps={data}

            />
        )
    })

    useEffect(() => {
        setDimensions({ width: containerRef.current.offsetWidth, height: containerRef.current.offsetHeight })
    }, [containerRef])

    useEffect(() => {
        if (selectedCountry) setOverlayOpacity(0.5)
        else setOverlayOpacity(0)

    }, [selectedCountry])


    useEffect(() => {


        const opacitySwicth = {
            "overallRoutes": { ...objectMap(featureOpacity, () => 0), countryBorder: 1 },
            "originCities": { ...objectMap(featureOpacity, () => 1), transect: 0 },
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

            mapRef.current.on('click', 'migration', (e) => {
                if (activeSource === "globeView") {
                    const globeElem = document.getElementById("globeView")
                    globeElem.scrollIntoView()
                    toggleMap()
                }
            })
        }

    }, [activeSource])
    return (
        <RouteContext.Provider value={routeValue}>
            <ScreenContext.Provider value={pointerPosValue}>
                <div className={styles.mapContainer}
                    onMouseMove={getMousePos}
                    ref={containerRef}
                >
                    <Map
                        initialViewState={{
                            longitude: perspective.lng,
                            latitude: perspective.lat,
                            zoom: perspective.zoom
                        }}
                        latitude={perspective.lat}
                        longitude={perspective.lng}
                        style={{
                            width: '100%', height: '100%'
                        }}
                        attributionControl={false}
                        interactiveLayerIds={
                            activeSource === "originCities" ? ["hoverable", "cities", "overlay"] :
                                activeSource === "transectSegment" ? ["migration-buffer", "hoverable", 'overlay'] :
                                    activeSource ? ["hoverable", "overlay"] : []}
                        zoom={perspective.zoom}
                        mapStyle={mapStyle}
                        ref={mapRef}
                        doubleClickZoom={false}
                        onMouseMove={onInfo}
                        dragPan={false}
                        dragRotate={false}
                        scrollZoom={false}
                    >
                        {(selectedCountry) && (countryTip)}
                        {(nonMigrantCountry) && (nonMigrantCountryTip)}
                        {(selectedCity && activeSource === 'originCities') && (cityTip)}
                        {(selectedSegment && activeSource === 'transectSegment') && (routeTip)}
                        {renderSource(activeSource, risks)}
                        <Layer {...layersObject["unselectedCountryOverlay"]}
                            filter={unselectedCountryFilter}
                            paint={{
                                ...layersObject["unselectedCountryOverlay"].paint,
                                "fill-opacity": overlayOpacity
                            }}
                        />
                        <Layer {...layersObject["countryLayer"]} />

                        <Layer {...highlightLayer} filter={filter} />
                        <Layer {...layersObject["overallRoutes"]}
                            paint={{
                                ...layersObject["overallRoutes"].paint,
                                "line-opacity": featureOpacity && featureOpacity.countryBorder,
                            }}
                        />

                        <Layer {...layersObject["migrationRouteStyle"]}
                            lineJoin="round"
                            paint={{
                                ...layersObject["migrationRouteStyle"].paint,
                                "line-opacity": featureOpacity && featureOpacity.transect,

                            }}
                        />
                        <Layer {...layersObject["migrationHover"]}
                            lineJoin="round"
                            filter={routeFilter}
                            paint={{
                                ...layersObject["migrationHover"].paint,
                                "line-opacity": featureOpacity && featureOpacity.transect,

                            }}
                        />
                        <Layer {...layersObject["cityStyle"]}
                            paint={{
                                ...layersObject["cityStyle"].paint,
                                "circle-opacity": featureOpacity && featureOpacity.originCities,

                            }} />
                        <Layer {...layersObject["cityMarkerHighlight"]} filter={cityHighlightFilter} />
                        <Layer {...layersObject["migrationBuffer"]} />
                        {width > 600 && (
                            <Layer {...layersObject["minorCountryLabel"]}
                                paint={{
                                    ...layersObject["minorCountryLabel"].paint,
                                    "text-opacity": featureOpacity && featureOpacity.countryBorder,

                                }}
                            />)}
                        {width > 600 && (
                            <Layer {...layersObject["majorCountryLabel"]}
                                paint={{
                                    ...layersObject["majorCountryLabel"].paint,
                                    "text-opacity": featureOpacity && featureOpacity.countryBorder,

                                }}
                            />)}
                        {activeSource && (<Layer {...layersObject["migrationHover"]} lineJoin="round" filter={routeFilter} />)}

                    </Map>
                </div >
            </ScreenContext.Provider>
        </RouteContext.Provider>
    )
}
