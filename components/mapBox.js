import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import Map, { Source, Layer } from 'react-map-gl'
import styles from '../styles/MapBox.module.css'
import stylesObject from './mapStyles';
import useWindowSize from '../hooks/useWindowSize';
import Tooltip from './toooltip';
import routeObject from './routePaths'



mapboxgl.accessToken = 'pk.eyJ1IjoibWl0Y2l2aWNkYXRhIiwiYSI6ImNpbDQ0aGR0djN3MGl1bWtzaDZrajdzb28ifQ.quOF41LsLB5FdjnGLwbrrg';
export default function MapBox({ activeSource, risks }) {
    const { width } = useWindowSize()
    const [mapStyle, setMapStyle] = useState('mapbox://styles/mitcivicdata/cld132ji3001h01rn1jxjlyt4')
    const [hoverInfo, setHoverInfo] = useState(null);
    const { layersObject, highlightLayer, desktopPerspective } = stylesObject(activeSource)
    const { pathsObject } = routeObject()
    const [dashStep, setDashStep] = useState(0)

    const dashArraySequence = [
        [0, 4, 3],
        [0.5, 4, 2.5],
        [1, 4, 2],
        [1.5, 4, 1.5],
        [2, 4, 1],
        [2.5, 4, 0.5],
        [3, 4, 0],
        [0, 0.5, 3, 3.5],
        [0, 1, 3, 3],
        [0, 1.5, 3, 2.5],
        [0, 2, 3, 2],
        [0, 2.5, 3, 1.5],
        [0, 3, 3, 1],
        [0, 3.5, 3, 0.5]
    ];


    const mapRef = useRef(null)
    const persepctive = useMemo(() => {
        if (width > 1000) return { ...desktopPerspective }
        if (600 < width < 1000) return { ...desktopPerspective, lat: 37, zoom: 2.9 }
        // return { ...desktopPerspective, zoom: 1, lat: -10, }
    })

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

    function renderGeoJson(data) {
        const sourceInfo = data.migrationRoutes
        if (sourceInfo) return (
            <>
                {
                    sourceInfo.map((source) => {
                        return (
                            <Source id={source.id} type='geojson' data={source.geojson} key={source.id} >
                                <Layer {...pathsObject[`${source.id}-path`]}></Layer>
                            </Source>
                        )
                    })
                }
            </>
        )
    }


    const onHover = useCallback(event => {
        const country = event.features && event.features[0];
        setHoverInfo({
            longitude: event.lngLat.lng,
            latitude: event.lngLat.lat,
            countryName: country && country.properties.ADM0_NAME
        });
    }, []);

    const selectedCountry = (hoverInfo && hoverInfo.countryName) || '';
    const filter = useMemo(() => ['in', 'ADM0_NAME', selectedCountry], [selectedCountry]);
    useEffect(() => {
        if (!mapRef.current) return
        let feautureID = null


        mapRef.current.on('mousemove', 'routes', (event) => {
            if (event.features.length === 0) return;

            if (feautureID !== null) {
                mapRef.current.removeFeatureState({
                    source: 'overall-routes',
                    id: feautureID,
                    sourceLayer: 'route_lagos-tripoli-9p3vru',
                });
            }

            feautureID = event.features[0].id
            mapRef.current.setFeatureState(
                {
                    source: 'overall-routes',
                    id: feautureID,
                    sourceLayer: 'route_lagos-tripoli-9p3vru',
                },
                {
                    hover: true
                })
        })

        mapRef.current.on('mouseleave', 'routes', () => {
            if (feautureID !== null) {
                mapRef.current.setFeatureState(
                    {
                        source: 'overall-routes',
                        id: feautureID,
                        sourceLayer: 'route_lagos-tripoli-9p3vru',
                    },
                    {
                        hover: false
                    }
                );
            }
            feautureID = null
        })

    })

    useEffect(() => {
        function animateDashArray(timestamp) {
            // Update line-dasharray using the next value in dashArraySequence. The
            // divisor in the expression `timestamp / 50` controls the animation speed.
            const newStep = parseInt(
                (timestamp / 1000) % dashArraySequence.length
            );

            if (newStep !== dashStep) {
                setDashStep(newStep)
            }

            // Request the next frame of the animation.
            requestAnimationFrame(animateDashArray);
        }
        console.log(dashArraySequence[dashStep])
        // start the animation
        animateDashArray(0);
    }, [dashStep])



    return (
        <div className={styles.mapContainer}>
            <Map
                initialViewState={{
                    longitude: persepctive.lng,
                    latitude: persepctive.lat,
                    zoom: persepctive.zoom
                }}
                style={{
                    width: '100%', height: '100%'
                }}
                interactiveLayerIds={
                    activeSource === 'originCities' ? ['hoverable'] : []}
                zoom={persepctive.zoom}
                mapStyle={mapStyle}
                ref={mapRef}
                onMouseMove={onHover}
                dragPan={false}
                scrollZoom={false}
            >
                {(selectedCountry && activeSource === 'originCities') && (
                    <Tooltip selectedCountry={selectedCountry} hoverInfo={hoverInfo} />
                )}
                {renderSource(activeSource, risks)}
                {/* {renderGeoJson(risks)} */}
                {activeSource === 'overallRoutes' && (renderMap(activeSource, risks.styles))}
                {/* {(renderMap(activeSource, risks.styles))} */}
                <Source id={risks.paths.id} type='vector' url={risks.paths.url} >
                    {/* {console.log(dashArraySequence[dashStep])} */}
                    <Layer {...layersObject["migrationRouteStyle"]} />
                </Source>
                {activeSource === 'originCities' && (renderMap(activeSource, risks.styles))}
                {activeSource === 'extremeHeat' && (renderMap(activeSource, risks.styles))}
                {activeSource === 'selectRoute' && (renderMap(activeSource, risks.styles))}
                {activeSource === 'originCities' && (<Layer {...highlightLayer} filter={filter} />)}
            </Map>
        </div >
    )
}











