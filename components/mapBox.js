import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import Map, { Source, Layer, Popup, useMap } from 'react-map-gl'
import styles from '../styles/MapBox.module.css'
import { Stack } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid'
import stylesObject from '../pages/maps/mapStyles';
import useWindowSize from '../hooks/useWindowSize';

const { layersObject, highlightLayer, desktopPerspective } = stylesObject

mapboxgl.accessToken = 'pk.eyJ1IjoibWl0Y2l2aWNkYXRhIiwiYSI6ImNpbDQ0aGR0djN3MGl1bWtzaDZrajdzb28ifQ.quOF41LsLB5FdjnGLwbrrg';
export default function MapBox({ activeSource, risks }) {
    const { width } = useWindowSize()

    console.log(stylesObject)

    const [mapStyle, setMapStyle] = useState('mapbox://styles/mitcivicdata/cld132ji3001h01rn1jxjlyt4')
    const [hoverInfo, setHoverInfo] = useState(null);


    const mapRef = useRef(null)
    const persepctive = useMemo(() => {
        if (width > 1000) return { ...desktopPerspective }
        if (600 < width < 1000) return { ...desktopPerspective, zoom: 2.5 }
        return { ...desktopPerspective, zoom: 2 }
    })


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
        const testMap = mapRef.current.getMap()

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

            const targetCoords = event.features[0].geometry.coordinates[0][30]
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
                interactiveLayerIds={
                    activeSource === 'originCities' ? ['hoverable'] : []}
                zoom={persepctive.zoom}
                mapStyle={mapStyle}
                ref={mapRef}
                onMouseMove={onHover}
            >
                {(selectedCountry && activeSource === 'originCities') && (
                    <Tooltip selectedCountry={selectedCountry} hoverInfo={hoverInfo} />
                )}
                {renderSource(activeSource, risks)}
                {activeSource === 'overallRoutes' && (renderMap(activeSource, risks.styles))}
                {activeSource === 'originCities' && (renderMap(activeSource, risks.styles))}
                {activeSource === 'extremeHeat' && (renderMap(activeSource, risks.styles))}
                {activeSource === 'originCities' && (<Layer {...highlightLayer} filter={filter} />)}
            </Map>
        </div >
    )
}

function Tooltip({ selectedCountry, hoverInfo }) {

    return (
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
                            return <span key={uuidv4()}>{entries} {i}</span>
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
        </Popup>
    )
}




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








