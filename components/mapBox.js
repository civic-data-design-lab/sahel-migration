import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useRef, useEffect, useState, useCallback, useMemo, createContext, useContext } from 'react';
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import Map, { Source, Layer } from 'react-map-gl'
import styles from '../styles/MapBox.module.css'
import stylesObject from './mapStyles';
import useWindowSize from '../hooks/useWindowSize';
import Tooltip from './toooltip';
import routeObject from './routePaths'
import { SectionContext } from '../pages';



mapboxgl.accessToken = 'pk.eyJ1IjoibWl0Y2l2aWNkYXRhIiwiYSI6ImNpbDQ0aGR0djN3MGl1bWtzaDZrajdzb28ifQ.quOF41LsLB5FdjnGLwbrrg';

export const RouteContext = createContext({
    feature: null,
    point: null,
    setFeature: (() => { }),
    setPoint: (() => { }),
})

export default function MapBox({ activeSource, risks }) {
    const { width } = useWindowSize()
    const [mapStyle, setMapStyle] = useState('mapbox://styles/mitcivicdata/cld132ji3001h01rn1jxjlyt4')
    const [hoverInfo, setHoverInfo] = useState(null);
    const [feature, setFeature] = useState(null)
    const [point, setPoint] = useState(null)
    const [routeClicked, toggleClick] = useState(false)
    const routeValue = { feature, point, setFeature, setPoint }
    const { layersObject, highlightLayer, desktopPerspective } = stylesObject(activeSource)
    const { pathsObject } = routeObject()
    const { currentSection, setSection } = useContext(SectionContext)

    function zoomFunction(number) {
        const x = number / 100
        // return 3.8 + 0.4 * Math.tanh((x - 8.5) / 1.5) + 0.3 * Math.tanh((x - 12.5) / 2.5) + 0.3 * Math.exp(-((x - 19) ** 2) / 2)
        // return -(1 / (2.5 * (Math.E ** ((number / 100 - 7) ** 2)))) + 3.7
        if (x <= 6) return 3.5
        if (6 <= x <= 19) return 3.26923076923 + 0.038461538461 * x
        return 4
    }
    function latFunction(number) {
        return ((-3 / (2.5 * (Math.E ** ((number * 2 / 100 - 14) ** 2)))) + 2) * 10
    }

    function lngFunction(number) {
        const exponent = -(number * 2.5 / 100 - 20)
        return 5 - (15 / (1 + Math.E ** exponent))
    }


    const mapRef = useRef(null)
    const persepctive = useMemo(() => {
        return { zoom: zoomFunction(width), lat: latFunction(width), lng: lngFunction(width) }
    }, [width])

    console.log(`width: ${width}, zoom: ${persepctive.zoom}`,)

    function renderMap(activeSource, styles) {
        const layerInfo = styles.layers.find((layer) => activeSource === layer.id)
        if (layerInfo) return (
            <>
                {
                    layerInfo.layerNames.map((name) => {

                        return (
                            <div key={name}>
                                <Layer {...layersObject[name]} />
                            </div>
                        )
                    })
                }
            </>

        )
    }
    function renderSource(activeSource, data) {
        const sourceInfo = data.sources
        if (sourceInfo) return (
            <>
                {
                    sourceInfo.map((source) => {
                        return <Source id={source.id} type='vector' url={source.url} key={source.id} />
                    })
                }
            </>
        )
    }
    const onHover = useCallback(event => {
        const country = event.features && event.features[0];
        setSection({
            index: country && country.properties.SEGMENT_INDEX,
            routeId: country && country.properties.SEGMENT
        })

        setHoverInfo({
            longitude: event.lngLat.lng,
            latitude: event.lngLat.lat,
            countryName: country && country.properties.ADM0_NAME
        });
    }, []);



    const selectedCountry = (hoverInfo && hoverInfo.countryName) || '';
    const selectedSegment = (currentSection && currentSection.routeId) || '';
    const countryNames = !selectedCountry ? [] : ['Ghana', 'Mali', 'Nigeria', 'Niger', 'Chad'].filter((elem) => {
        return elem !== selectedCountry
    })
    const filter = useMemo(() => ['in', 'ADM0_NAME', selectedCountry], [selectedCountry]);
    const highlightFilter = useMemo(() => ['in', ['get', 'ADM0_NAME'], ["literal", countryNames]], [selectedCountry]);
    const routeFilter = useMemo(() => ['in', 'SEGMENT', selectedSegment], [selectedSegment]);

    // useEffect(() => {
    //     if (!mapRef.current) return
    //     let feautureID = null

    //     mapRef.current.on('mousemove', 'routes', (event) => {
    //         if (event.features.length === 0) return;

    //         if (feautureID !== null) {
    //             mapRef.current.removeFeatureState({
    //                 source: 'overall-routes',
    //                 id: feautureID,
    //                 sourceLayer: 'route_lagos-tripoli-9p3vru',
    //             });
    //         }

    //         feautureID = event.features[0].id
    //         mapRef.current.setFeatureState(
    //             {
    //                 source: 'overall-routes',
    //                 id: feautureID,
    //                 sourceLayer: 'route_lagos-tripoli-9p3vru',
    //             },
    //             {
    //                 hover: true
    //             })
    //     })

    //     mapRef.current.on('mouseleave', 'routes', () => {
    //         if (feautureID !== null) {
    //             mapRef.current.setFeatureState(
    //                 {
    //                     source: 'overall-routes',
    //                     id: feautureID,
    //                     sourceLayer: 'route_lagos-tripoli-9p3vru',
    //                 },
    //                 {
    //                     hover: false
    //                 }
    //             );
    //         }
    //         feautureID = null
    //     })

    // },)

    return (
        <RouteContext.Provider value={routeValue}>
            <div className={styles.mapContainer}>
                <Map
                    initialViewState={{
                        longitude: persepctive.lng,
                        latitude: persepctive.lat,
                        zoom: persepctive.zoom
                    }}
                    latitude={persepctive.lat}
                    longitude={persepctive.lng}
                    style={{
                        width: '100%', height: '100%'
                    }}
                    interactiveLayerIds={activeSource ? ['migration-buffer', "hoverable"] : []}
                    zoom={persepctive.zoom}
                    mapStyle={mapStyle}
                    ref={mapRef}
                    doubleClickZoom={false}
                    onMouseMove={onHover}
                    dragPan={false}
                    scrollZoom={false}
                >
                    {(selectedCountry && activeSource === 'originCities') && (
                        <Tooltip selectedCountry={selectedCountry} hoverInfo={hoverInfo} />
                    )}
                    {(selectedCountry && activeSource === 'overallRoutes') && (
                        <Tooltip selectedCountry={selectedCountry} hoverInfo={hoverInfo} />
                    )}
                    {(selectedCountry && activeSource === 'extremeHeat') && (
                        <Tooltip selectedCountry={selectedCountry} hoverInfo={hoverInfo} />
                    )}
                    {renderSource(activeSource, risks)}



                    {activeSource === 'overallRoutes' && (renderMap(activeSource, risks.styles))}
                    {activeSource === 'originCities' && (renderMap(activeSource, risks.styles))}
                    {activeSource === 'extremeHeat' && (renderMap(activeSource, risks.styles))}
                    {activeSource === 'selectRoute' && (renderMap(activeSource, risks.styles))}
                    {activeSource === 'originCities' && (
                        <>
                            <Layer {...highlightLayer} filter={filter} />
                            <Layer {...layersObject["countryFill"]} filter={highlightFilter} />
                            <Layer {...layersObject["migrationHover"]} lineJoin="round" filter={routeFilter} />
                        </>
                    )}
                    {activeSource === 'overallRoutes' && (
                        <>
                            <Layer {...highlightLayer} filter={filter} />
                            <Layer {...layersObject["countryFill"]} filter={highlightFilter} />
                            <Layer {...layersObject["migrationHover"]} lineJoin="round" filter={routeFilter} />
                        </>
                    )}
                    {activeSource === 'extremeHeat' && (
                        <>
                            <Layer {...highlightLayer} filter={filter} />
                            <Layer {...layersObject["countryFill"]} filter={highlightFilter} />
                            <Layer {...layersObject["migrationHover"]} lineJoin="round" filter={routeFilter} />
                        </>
                    )}
                    {activeSource === 'selectRoute' && (
                        <>
                            <Layer {...highlightLayer} filter={filter} />
                            <Layer {...layersObject["countryFill"]} filter={highlightFilter} />
                            <Layer {...layersObject["migrationHover"]} lineJoin="round" filter={routeFilter} />
                        </>
                    )}

                    {activeSource && (<Layer {...layersObject["migrationHover"]} lineJoin="round" filter={routeFilter} />)}

                </Map>
            </div >
        </RouteContext.Provider>
    )
}











