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
import Map, { Source, Layer, useMap } from 'react-map-gl';
import styles from './../../styles/MapBox.module.css';
import stylesObject from './mapStyles';
import useWindowSize from './../../hooks/useWindowSize';
import useMapView from './../../hooks/useMapView';
import ToolTip from './popup/tooltip';
import { SectionContext } from './../../pages';
import { Metamorphous } from '@next/font/google';

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
/** 
 * [bar description]
 * @param  {any} map map object
 * @param  {[]} styles all styles to be shown on the map (from json file)
 * @return {[]}     all styles to be shown on the map
*/
// function retrieveMapStyles(map, interactiveStyles) {
//     if (map && ("getStyle" in map)) {
//         const mapStyles = map.getStyle().layers
//         return mapStyles.filter(style => interactiveStyles.includes(style.id))
//     }
// }


function setLayerVisibility(map, layers) {
    if (map && layers) {
        layers.forEach(layer => {
            map.getMap().setLayoutProperty(layer.id, 'visibility', 'visible')
        });
    }
}

function setLayersOpacity(map, allLayers, seenLayers) {
    if (map && allLayers && seenLayers) {
        const mapStyles = map.getStyle().layers.map(layer => layer.id)
        const seenLayerNames = seenLayers.map(layer => layer.id)
        allLayers.forEach(layer => {
            const type = layer.type === "symbol" ? "text" : layer.type
            if (!mapStyles.includes(layer.id)) return
            if (seenLayerNames.includes(layer.id)) {
                map
                    .getMap()
                    .setPaintProperty(layer.id, `${type}-opacity`, 1)
                if (type === "circle")
                    map
                        .getMap()
                        .setPaintProperty(layer.id, `${type}-stroke-opacity`, 1)
                if ("buffer?" in seenLayers.find(seenLayer => seenLayer.id === layer.id)) {
                    map
                        .getMap()
                        .setPaintProperty(layer.id, `${type}-opacity`, 0)
                }
            } else {
                if (type === "circle")
                    map
                        .getMap()
                        .setPaintProperty(layer.id, `${type}-stroke-opacity`, 0)
                map
                    .getMap()
                    .setPaintProperty(layer.id, `${type}-opacity`, 0)
            }
        })
    }
}

function setLayersFilters(map, layers, selectedFeature) {
    if (map && layers) {
        const layersWithFilters = layers.filter(layer => "filter" in layer)
        layersWithFilters.forEach(layer => {
            if (!layer) return
            if (!selectedFeature) {
                map
                    .getMap()
                    .setFilter(layer.id, [...(layer.filter), " "])
                return
            }
            const filteredProperty = layer.property
            const selectedProperty = selectedFeature.properties[`${filteredProperty}`]
            // console.log(selectedProperty)
            if (!selectedProperty) return
            map
                .getMap()
                .setFilter(layer.id, [...(layer.filter), String(selectedProperty)])
        })
    }
}


export default function MapBox({ activeSource, risks, cityData, toggleMap }) {
    const { width } = useWindowSize()
    const [mapStyle, setMapStyle] = useState('mapbox://styles/mitcivicdata/cld132ji3001h01rn1jxjlyt4')
    const { zoom, lng, lat } = useMapView()
    const [hoverInfo, setHoverInfo] = useState(null);
    const [cityInfo, setCityInfo] = useState(null);
    const [pointerCoords, setCoordinates] = useState({ posX: 0, posY: 0 })
    const [containerDimensions, setDimensions] = useState({ width: 0, height: 0 })
    const [routeInfo, setRouteInfo] = useState(null);
    const [feature, setFeature] = useState(null)
    const [selectedFeature, setSelectedFeature] = useState(null)
    const [point, setPoint] = useState(null)
    const routeValue = { feature, point, setFeature, setPoint }
    const { current: map } = useMap()

    const { layersObject, highlightLayer } = stylesObject(activeSource)
    const { currentSection, setSection } = useContext(SectionContext)
    const [overlayOpacity, setOverlayOpacity] = useState(0)
    const [featureOpacity, setFeatureOpacity] = useState({
        countryBorder: 1,
        originCities: 0,
        transect: 0,
        countryOverlay: 0,

    })

    let getMousePos = (event) => {
        setCoordinates({ posX: event.pageX, posY: event.pageY })
    };
    const containerRef = useRef(null)
    const mapRef = useRef(null)

    const mapCenter = {
        lng: lng,
        lat: lat,
    }
    const pointerPosValue = { pointerCoords, setCoordinates, containerDimensions, setDimensions, mapCenter }
    function renderLayers(allLayers, currentNarrative, selectedFeature, map) {
        if (allLayers && currentNarrative && map) {
            // console.log(currentNarrative)
            return (
                <>
                    {allLayers.map(layer => {
                        const type = layer.type === "symbol" ? "text" : layer.type
                        const currentNarrativeLayerIds = currentNarrative.map(narrativeLayer => narrativeLayer.id)
                        const layerOpacity = currentNarrativeLayerIds.includes(layer.id) ? 1 : 0
                        const opacityProperties = {}
                        const layerProperties = {}
                        opacityProperties[`${type}-opacity`] = layerOpacity
                        if (type === "circle") {
                            if (!(`${type}-color` in layer.paint)) opacityProperties[`${type}-opacity`] = 0
                            opacityProperties[`${type}-stroke-opacity`] = layerOpacity
                        }
                        if ("layout" in layer) layerProperties["layout"] = { ...layer["layout"], visibility: "visible" }
                        const currentNarrativeLayer = currentNarrative.find(narrativeLayer => narrativeLayer.id === layer.id)
                        if (currentNarrativeLayer?.filter) {
                            const layerFilter = currentNarrative.find(narrativeLayer => narrativeLayer.id == layer.id).filter || ["in", "property", " "]
                            layerProperties["filter"] = selectedFeature && currentNarrativeLayer.property in selectedFeature ?
                                [...layerFilter, selectedFeature[currentNarrativeLayer.property]] :
                                layerFilter

                        }
                        return (

                            < Layer
                                {...layerProperties}
                                paint={{
                                    ...layer["paint"],
                                    ...opacityProperties
                                }}
                                type={layer.type}
                                source={layer.source}
                                source-layer={layer["source-layer"]}
                                beforeId={layer.id}
                                id={`${layer.id}_rendered`}
                                key={layer.id}
                            />
                        )
                    })
                    }
                </>
            )
        }
    }


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
    // const mapLayers = retrieveMapStyles(mapRef.current, risks.styles.usedLayerNames)
    useEffect(() => {
        if (mapRef.current) {
            // setLayerVisibility(mapRef.current, mapLayers)
            // mapRef.current.on('load', () => {
            //     setLayersOpacity(mapRef.current, mapLayers, risks.styles.narrativeToLayer.overallRoutes.layers)
            // })
        }
    })

    const onInfo = useCallback((event) => {
        const region = event.features && event.features[0];
        let routeIndex = region && region.properties.segement_i
        let routeId = region && region.properties.segement_i
        let migrantCountryName = region && region.properties.COUNTRY
        setSelectedFeature(region && region.properties)

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
            migrantCountryName: migrantCountryName,
            nonMigrantCountryName: (region && region.properties.name_en) || migrantCountryName,
        });

        // const seenLayers = risks
        //     .styles
        //     .narrativeToLayer[activeSource]
        //     .layers

        // setLayersFilters(mapRef.current, seenLayers, region)
    }, [activeSource]);

    const selectedCountry = (hoverInfo && hoverInfo.migrantCountryName) || '';
    const nonMigrantCountry = (hoverInfo && hoverInfo.nonMigrantCountryName) || '';
    const selectedCity = (cityInfo && cityInfo.cityName) || '';
    const countryOfSelectedCity = (cityInfo && cityInfo.countryName) || '';
    const selectedSegment = (currentSection && currentSection.routeId) || '';
    const countryNames = !selectedCountry
        ? []
        : ['Ghana', 'Mali', 'Nigeria', 'Niger', 'Chad'].filter((elem) => {
            return elem !== selectedCountry;
        });
    const filter = useMemo(() => ['in', 'COUNTRY', selectedCountry], [selectedCountry]);
    const nonMigrantCountryFilter = useMemo(() => ['in', 'name_en',
        (nonMigrantCountry || countryOfSelectedCity) === "Côte d'Ivoire" ? "Ivory Coast" : (nonMigrantCountry || countryOfSelectedCity)
    ], [nonMigrantCountry, countryOfSelectedCity]);
    const citiesSelectedCountryFilter = useMemo(() => ['in', 'country_origin',
        (selectedCountry || countryOfSelectedCity) == "Côte d'Ivoire" ? "Côt" :
            (selectedCountry || countryOfSelectedCity) == "Burkina Faso" ? "Burkin" :
                (selectedCountry || countryOfSelectedCity) == "Sierra Leone" ? "Sierr" :
                    selectedCountry || countryOfSelectedCity],
        [selectedCountry, countryOfSelectedCity]);
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
    const routeFilter = useMemo(() => ['in', 'index', String(selectedSegment)], [selectedSegment]);

    const countryToolTipData = {
        ...hoverInfo,
        type: "country",
        cityData: cityData,
        migrantData: risks && risks.migrantData,
        selectedCountry: selectedCountry,
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

    const [countryTip, cityTip, routeTip] = [countryToolTipData, cityToolTipData, routeToolTipData].map(data => {
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
        if (selectedCountry) setOverlayOpacity(0.35)
        else setOverlayOpacity(0)

    }, [selectedCountry])




    // if (activeSource === "overallRoutes") {
    //     setLayersOpacity(mapRef.current, mapLayers, risks.styles.narrativeToLayer.overallRoutes.layers)
    // }

    // useEffect(() => {
    //     if (mapRef.current) {
    //         console.log(mapRef.current.getMap().getStyle().layers)
    //     }
    // }, [])


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
            // console.log(mapRef.current.getMap().getStyle().layers)

            // console.log(mapRef.current..getStyle().layers)
            mapRef.current.on('load', () => {
                mapRef.current.resize()
            })
            // setLayersOpacity(mapRef.current, mapLayers, risks.styles.narrativeToLayer[activeSource].layers)

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

    // const mapLayers = retrieveMapStyles(mapRef.current, risks.styles.usedLayerNames)
    // const seenLayers = risks
    //     .styles
    //     .narrativeToLayer[activeSource]
    //     .layers


    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.on('load', () => {
                mapRef.current.getMap().setLayoutProperty("wa-ifpri-countries-outline", "visibility", "visible")
                mapRef.current.getMap().setLayoutProperty("libya-outline", "visibility", "visible")
            })
        }
    })
    return (
        <RouteContext.Provider value={routeValue}>
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
                            activeSource === "originCities" ? ["hoverable", "cities", "overlay"] :
                                activeSource === "transectSegment" ? ["migration-buffer", "hoverable", 'overlay', "cities"] :
                                    activeSource ? ["hoverable", "overlay", "cities"] : ['hoverable']}
                        // interactiveLayerIds={
                        //     (mapLayers && seenLayers) ? risks
                        //         .styles
                        //         .narrativeToLayer[activeSource]
                        //         .layers
                        //         .map(layer => `${layer.id}`) : []
                        // }
                        zoom={zoom}
                        mapStyle={mapStyle}
                        ref={mapRef}
                        doubleClickZoom={false}
                        onMouseMove={onInfo}
                        dragPan={false}
                        dragRotate={false}
                        scrollZoom={false}
                    >
                        {(selectedCountry) && (countryTip)}
                        {(selectedCity) && (cityTip)}
                        {(selectedSegment && activeSource === 'transectSegment') && (routeTip)}
                        {renderSource(activeSource, risks)}

                        {/* {renderLayers(mapLayers, seenLayers, selectedFeature, mapRef.current)} */}
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
                        {(width > 600 && (!selectedCountry || (activeSource === 'transectSegment'))) && (

                            <Layer {...layersObject["nonMigrantCountryLabel"]}
                                filter={nonMigrantCountryFilter}
                            />)}
                        {activeSource === "transectSegment" && (<Layer {...layersObject["transectCountryLabel"]} />)}
                    </Map>
                </div >
            </ScreenContext.Provider>
        </RouteContext.Provider>
    )
}
