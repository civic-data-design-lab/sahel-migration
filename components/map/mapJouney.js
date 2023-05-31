import React, { useRef, useEffect, useState, useContext } from 'react';
import mapboxgl from '!mapbox-gl';
import styles from '../../styles/MapJourney.module.css';
import { renderToString } from 'react-dom/server'
import stylesObject from './mapStyles';
import TransectTip from './transecttip';
import { SectionContext } from '../../pages';

mapboxgl.accessToken =
    'pk.eyJ1IjoibWl0Y2l2aWNkYXRhIiwiYSI6ImNpbDQ0aGR0djN3MGl1bWtzaDZrajdzb28ifQ.quOF41LsLB5FdjnGLwbrrg';
export default function MapJourney({ journeys }) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(3);
    const [lat, setLat] = useState(25);
    const [zoom, setZoom] = useState(3.65);
    const [canExplore, setExplore] = useState(false);
    const { layersObject, highlightLayer } = stylesObject()

    const { currentSection, setSection } = useContext(SectionContext)
    const routeId = currentSection && currentSection.routeId

    function keys(object) {
        return Object.keys(object)
    }
    function values(object) {
        return Object.values(object)
    }

    function intersection(setA, setB) {
        console.log(setA)
        console.log(setB)
        const _intersection = new Set();
        for (const elem of setB) {
            if (setA.has(elem)) {
                _intersection.add(elem);
            }
        }
        return _intersection;
    }



    useEffect(() => {
        setExplore(true);

        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mitcivicdata/cld132ji3001h01rn1jxjlyt4',
            center: [lng, lat],
            zoom: zoom,
            attributionControl: false,

        });
        const mapInteractions = [
            "boxZoom",
            "doubleClickZoom",
            "dragPan",
            "dragRotate",
            "keyboard",
            "scrollZoom",
            "touchZoomRotate"
        ]

        //Disabbles all map interactions except for onClick
        mapInteractions.forEach(handler => {
            map.current[handler].disable()
        })

        const popup = new mapboxgl.Popup({
            closeButton: false
        });


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
                        'line-width': 80
                    },
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
                map.current.addSource('outline', {
                    'type': 'vector',
                    'url': 'mapbox://mitcivicdata.6egts54c'
                });

                // The feature-state dependent fill-opacity expression will render the hover effect
                // when a feature's hover state is set to true.
                map.current.addLayer({
                    'id': 'transect-outline',
                    'type': 'line',
                    // 'promoteId': ['feature-state', 'SEGMENT_ID'],
                    'source': 'outline',
                    'source-layer': 'route-buffer-a8wlk1',
                    'layout': {
                        'line-join': 'round',
                        'line-cap': 'round',
                    },
                    'paint': {
                        'line-color': 'white',
                        'line-width': 2
                    },
                    'filter': ['in', 'SEGMENT_ID', '']
                });

                map.current.on('mousemove', 'transect-buffer', (e) => {
                    // Use the first found feature.
                    const feature = e.features[0];

                    map.current.setFilter('transect-outline', [
                        'in',
                        'SEGMENT_ID',
                        feature.properties.segement_i
                    ]);

                    const riskTypes = [
                        { "Reported Violence": "risk_4mi" },
                        { "Conflict Events": "risk_acled" },
                        { "Food Insecurity": "risk_food" },
                        { "Reliance on Smugglers": "Risk_smugg" },
                        { "Remoteness": "risk_remot" },
                        { "Heat Exposure": "risk_heat" },
                    ]
                    const hoverData = {
                        risks: riskTypes.map((risk, index) => {
                            const names = riskTypes.map(obj => keys(obj)[0])
                            const riskProperties = riskTypes.map(obj => values(obj)[0])
                            const riskLevel = feature && feature.properties[riskProperties[index]]
                            return { name: names[index], riskLevel: riskLevel }
                        }),
                        totalRisk: feature && feature.properties.risks_tota,
                        routeId: feature && feature.properties.segement_i
                    }

                    const myDiv = document.createElement('div');
                    const innerHTML = renderToString(<TransectTip
                        hoverInfo={{ ...hoverData }}
                    />)
                    myDiv.innerHTML = innerHTML
                    popup
                        .setLngLat(e.lngLat)
                        .setDOMContent(myDiv)
                        .addTo(map.current);
                })

                map.current.on('mouseleave', 'transect-buffer', () => {
                    map.current.setFilter('transect-outline', ['in', 'SEGMENT_ID', '']);
                    popup.remove()
                });

            });
            map.current.on('click', 'transect-buffer', (e) => {
                const routeFeature = e.features && e.features[0].properties // grabs a single feature from the clicked route segment
                const routeId = routeFeature.segement_i
                const journey = journeys[routeId] // selects journey url from url list (index given by routeId)
                if (journey) window.location.href = '/journeys/' + journey.route
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
