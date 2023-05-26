import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl';
import styles from '../../styles/MapJourney.module.css';
import stylesObject from './mapStyles';
mapboxgl.accessToken =
    'pk.eyJ1IjoibWl0Y2l2aWNkYXRhIiwiYSI6ImNpbDQ0aGR0djN3MGl1bWtzaDZrajdzb28ifQ.quOF41LsLB5FdjnGLwbrrg';
export default function MapJourney({ explorable }) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(3);
    const [lat, setLat] = useState(25);
    const [zoom, setZoom] = useState(3.65);
    const [canExplore, setExplore] = useState(false);
    const { layersObject, highlightLayer } = stylesObject()

    useEffect(() => {
        setExplore(true);

        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mitcivicdata/cld132ji3001h01rn1jxjlyt4',
            center: [lng, lat],
            zoom: zoom,
            attributionControl: false
        });

        let hoveredRouteId = null;

        map.current.on('load', () => {
            map.current.addSource('transect-route', {
                type: 'vector',
                url: 'mapbox://mitcivicdata.transect-segments'
            });
            map.current.addLayer(
                {
                    'id': 'transect-line',
                    'type': 'line',
                    'source': 'transect-route',
                    'source-layer': 'transect-segments',
                    'layout': {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    paint: layersObject["migrationRouteStyle"].paint
                }
            );
            map.current.addLayer(
                {
                    'id': 'transect-buffer',
                    'type': 'line',
                    'source': 'transect-route',
                    'source-layer': 'transect-segments',
                    'layout': {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    paint: {
                        'line-opacity': 0,
                        'line-width': 30
                    }
                }
            );

        })
        if (true) {
            map.current.setProjection('globe');
            setTimeout(() => {
                map.current.flyTo({
                    center: [4.998172, 20.506743],
                    zoom: 4.85,
                    speed: 0.5,
                    curve: 1,
                    pitch: 50,
                    bearing: -48,
                    easing(t) {
                        return t;
                    },
                });
            }, 3000);

            map.current.on('load', () => {
                map.current.addSource('buffer', {
                    'type': 'vector',
                    'url': 'mapbox://mitcivicdata.6egts54c'
                });

                // The feature-state dependent fill-opacity expression will render the hover effect
                // when a feature's hover state is set to true.
                map.current.addLayer({
                    'id': 'buffer-segments',
                    'type': 'line',
                    // 'promoteId': 'SEGMENT_ID',
                    'source': 'buffer',
                    'source-layer': 'route-buffer-a8wlk1',
                    'layout': {
                        'line-join': 'round',
                        'line-cap': 'round',
                    },
                    'paint': {
                        'line-color': 'white',
                        'line-opacity': [
                            'case',
                            ['boolean', ['feature-state', 'hover'], false],
                            1,
                            0
                        ],
                        'line-width': 2
                    }
                });


                // When the user moves their mouse over the state-fill layer, we'll update the
                // feature state for the feature under the mouse.
                map.current.on('mousemove', ['buffer-segments', 'transect-buffer'], (e) => {
                    let features = e.features
                    let oultlineFeatures = features.filter(feature => feature.sourceLayer === "route-buffer-a8wlk1")
                    // console.log(features.map(feature => feature.layer.id))
                    // console.log(my)

                    if (oultlineFeatures.length > 0) {
                        if (hoveredRouteId !== null) {
                            map.current.setFeatureState(
                                { source: 'buffer', id: hoveredRouteId, sourceLayer: 'route-buffer-a8wlk1' },
                                { hover: false }
                            );
                        }
                        // console.log(features[0].id)
                        hoveredRouteId = oultlineFeatures[0].id;
                        map.current.setFeatureState(
                            { source: 'buffer', id: hoveredRouteId, sourceLayer: 'route-buffer-a8wlk1' },
                            { hover: true }
                        );
                    }
                });

                // When the mouse leaves the state-fill layer, update the feature state of the
                // previously hovered feature.
                map.current.on('mouseleave', ['buffer-segments', 'transect-buffer'], () => {
                    if (hoveredRouteId !== null) {
                        map.current.setFeatureState(
                            { source: 'buffer', id: hoveredRouteId, sourceLayer: 'route-buffer-a8wlk1' },
                            { hover: false }
                        );
                    }
                    hoveredRouteId = null;
                });
            })
        }
    }, [canExplore]);

    return (
        <div className={styles.container}>
            <div ref={mapContainer} className={styles.mapContainer} />
            <div className={styles.gates} />
        </div>
    );
}
