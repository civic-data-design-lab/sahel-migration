import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useRef, useEffect, useState, createContext, useCallback } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import Map, { Source, Layer } from 'react-map-gl'
import Image from 'react-map-gl'
import styles from '../styles/MapBox.module.css'
import { Col, Stack } from 'react-bootstrap';
import {
    routeStyle,
    countryStyle,
    cityStyle,
    countryBorderStyle,
    desktopPerspective,
    mobilePerspective,
    INITIAL_VIEW_STATE,
    countryLabels,
} from '../pages/maps/mapStyles';
import useWindowSize from '../hooks/useWindowSize';

mapboxgl.accessToken = 'pk.eyJ1IjoibWl0Y2l2aWNkYXRhIiwiYSI6ImNpbDQ0aGR0djN3MGl1bWtzaDZrajdzb28ifQ.quOF41LsLB5FdjnGLwbrrg';
export default function MapBox({ countryData, cityData, routeData, activeSource, risks }) {
    const { width } = useWindowSize()

    const [mapStyle, setMapStyle] = useState('mapbox://styles/mitcivicdata/cld132ji3001h01rn1jxjlyt4')
    const [hoverInfo, setHoverInfo] = useState(null);

    const mapRef = useRef(null)
    const [persepctive, setPerspective] = useState(desktopPerspective)
    const hoverLayer = {
        'id': 'hoverable',
        'type': 'fill',
        'paint': {
            'fill-color': 'rgba(0,0,0,0)'
        }
    };

    const onHover = useCallback(event => {
        const {
            features,
            point: { x, y }
        } = event;
        const hoveredFeature = features && features[0];

        // prettier-ignore
        setHoverInfo(hoveredFeature && { feature: hoveredFeature, x, y });
    }, []);

    return (
        <div style={{ zIndex: -5, position: 'absolute', inset: 0 }}>
            <Map
                initialViewState={{
                    longitude: persepctive.lng,
                    latitude: persepctive.lat,
                    zoom: persepctive.zoom
                }}
                style={{
                    width: '100vw', height: '100%'
                }}
                longitude={persepctive.lng}
                interactiveLayerIds={['hoverable', 'country-outline']}
                latitude={persepctive.lat}
                zoom={
                    width < 900 ? mobilePerspective.zoom : desktopPerspective.zoom
                }
                mapStyle={mapStyle}
                ref={mapRef}
                // interactive={false}
                onMouseMove={onHover}
            >
                {activeSource === 'cities' && (
                    <>
                        <Source id='selected-countries' type='geojson' data={JSON.parse(countryData)}>
                            <Image id='hatch' />
                            <Layer {...countryBorderStyle} />
                            <Layer {...hoverLayer} />
                        </Source>
                        <Source id='origin-cities' type='geojson' data={JSON.parse(cityData)}>
                            <Layer {...cityStyle} />
                        </Source>
                        <Source id='selected-countries-label' type='geojson' data={JSON.parse(countryData)}>
                            <Layer {...countryLabels} />
                        </Source>

                    </>
                )
                }
                {hoverInfo && (
                    <>
                        <Tooltip hoverInfo={hoverInfo}></Tooltip>
                    </>
                )}
                {activeSource === 'route' && (
                    <Source id='land-routes' type='geojson' data={JSON.parse(routeData)}>
                        <Layer {...routeStyle} />
                    </Source>
                )}
            </Map>
        </div >
    )
}

function Tooltip({ hoverInfo }) {

    return (
        <div className={styles.tooltip} style={{ left: hoverInfo.x, top: hoverInfo.y }}>
            <h2>{hoverInfo.feature.properties.ADM0_NAME}</h2>
            <div className={styles.tooltipInfo}>
                <Stack>
                    <span>xxx,xxx {hoverInfo.feature.properties.ADM0_NAME} mirgants in Libya</span>
                    <span>xxx,xxx km from start to end</span>
                </Stack>
                <Stack style={{ marginTop: '0.5rem' }}>
                    <span>Top origin cities of {hoverInfo.feature.properties.ADM0_NAME} migrants</span>
                    {['15%', '14%', '13%', '12%'].map((entries, i) => {
                        return <span>{entries} {i}</span>
                    })}
                </Stack>
            </div>
            <span style={{ marginTop: '0.5rem' }}>IPC Food Security in Origin Country</span>
            <div className={styles.bar}>
                <div style={{ flexBasis: '70%', backgroundColor: '#B9BF8B' }}></div>
                <div style={{ flex: 1, backgroundColor: '#EADD97' }}></div>
                <div style={{ flex: 1, backgroundColor: '#DF9B6F' }}></div>
            </div>
            <div style={{ width: '100%', display: 'flex', position: 'relative', justifyContent: 'flex-end' }}>
                <span style={{ textAlign: 'right', right: '0', width: '70%' }}>Moderatel or Serverly Food Insecure</span>
            </div>
        </div >
    )
}









