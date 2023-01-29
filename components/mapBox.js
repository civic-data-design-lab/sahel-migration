import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useRef, useEffect, useState, createContext, useCallback, useMemo } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import Map, { Source, Layer, Popup } from 'react-map-gl'
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
    countryLayer,
    highlightLayer,
    heatmapLayer
} from '../pages/maps/mapStyles';
import useWindowSize from '../hooks/useWindowSize';

mapboxgl.accessToken = 'pk.eyJ1IjoibWl0Y2l2aWNkYXRhIiwiYSI6ImNpbDQ0aGR0djN3MGl1bWtzaDZrajdzb28ifQ.quOF41LsLB5FdjnGLwbrrg';
export default function MapBox({ countryData, cityData, routeData, activeSource, risks, heatData }) {
    const { width } = useWindowSize()

    const [mapStyle, setMapStyle] = useState('mapbox://styles/mitcivicdata/cld132ji3001h01rn1jxjlyt4')
    const [hoverInfo, setHoverInfo] = useState(null);

    const mapRef = useRef(null)
    const [persepctive, setPerspective] = useState(desktopPerspective)


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
                interactiveLayerIds={['hoverable']}
                latitude={persepctive.lat}
                zoom={
                    width < 900 ? mobilePerspective.zoom : desktopPerspective.zoom
                }
                mapStyle={mapStyle}
                ref={mapRef}
                onMouseMove={onHover}
            >
                {activeSource === 'cities' && (
                    <>
                        <Source type='geojson' data={JSON.parse(countryData)}>
                            <Layer {...countryBorderStyle} />
                            <Layer {...countryLayer} />
                            <Layer {...highlightLayer} filter={filter} />
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
                {selectedCountry && (
                    <Popup style={{
                        width: '240px',
                        display: 'flex',
                        flexDirection: 'column-reverse',
                    }}
                        longitude={hoverInfo.longitude}
                        latitude={hoverInfo.latitude}
                        offset={[0, -10]}
                        anchor={'bottom'}
                        closeButton={false}
                        className="county-info"
                    >
                        <Tooltip selectedCountry={selectedCountry} />
                    </Popup>)}
                {activeSource === 'route' && (
                    <>
                        <Source id='land-routes' type='geojson' data={JSON.parse(routeData)}>
                            <Layer {...routeStyle} />
                        </Source>
                        <Source type="geojson" data={JSON.parse(heatData)}>
                            <Layer {...heatmapLayer} />
                        </Source>
                    </>
                )}
            </Map>
        </div >
    )
}

function Tooltip({ selectedCountry }) {

    return (
        <div className={styles.tooltip}>
            <h2>{selectedCountry}</h2>
            <div className={styles.tooltipInfo}>
                <Stack>
                    <span>xxx,xxx {selectedCountry} mirgants in Libya</span>
                    <span>xxx,xxx km from start to end</span>
                </Stack>
                <Stack style={{ marginTop: '0.5rem' }}>
                    <span>Top origin cities of {selectedCountry} migrants</span>
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


function renderMap(activeSource) {
    return (
        <Layer {...layerStyle} />
    )


}








