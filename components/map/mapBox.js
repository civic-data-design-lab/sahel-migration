import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useRef, useEffect, useState, useCallback, useMemo, createContext, useContext } from 'react';
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import Map, { Source, Layer } from 'react-map-gl'
import styles from './../../styles/MapBox.module.css'
import stylesObject from './mapStyles';
import useWindowSize from './../../hooks/useWindowSize';
import Tooltip from './toooltip';
import routeObject from './routePaths'
import { SectionContext } from './../../pages';
import CityTip from './citytip';



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
    const [cityInfo, setCityInfo] = useState(null);
    const [feature, setFeature] = useState(null)
    const [point, setPoint] = useState(null)
    const [routeClicked, toggleClick] = useState(false)
    const routeValue = { feature, point, setFeature, setPoint }
    const { layersObject, highlightLayer } = stylesObject(activeSource)
    const { currentSection, setSection } = useContext(SectionContext)

    const [opacity, setOpacity] = useState(0)
    // const cityLayer = { ...layersObject["cityStyle"], paint: { "circle-opacity": opacity && 1 } }


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
        const region = event.features && event.features[0];
        setSection({
            index: region && region.properties.segement_i,
            routeId: region && region.properties.segement_i
        })
        setCityInfo({
            longitude: event.lngLat.lng,
            latitude: event.lngLat.lat,
            cityName: region && region.properties.city_origin,
            countryName: region && region.properties.country_origin,
            migrantCount: region && region.properties.count
        })

        setHoverInfo({
            longitude: event.lngLat.lng,
            latitude: event.lngLat.lat,
            countryName: region && region.properties.ADM0_NAME
        });
    }, []);



    const selectedCountry = (hoverInfo && hoverInfo.countryName) || '';
    const selectedCity = (cityInfo && cityInfo.cityName) || '';
    const selectedSegment = (currentSection && currentSection.routeId) || '';
    const countryNames = !selectedCountry ? [] : ['Ghana', 'Mali', 'Nigeria', 'Niger', 'Chad'].filter((elem) => {
        return elem !== selectedCountry
    })
    const filter = useMemo(() => ['in', 'ADM0_NAME', selectedCountry], [selectedCountry]);
    const highlightFilter = useMemo(() => ['in', ['get', 'ADM0_NAME'], ["literal", countryNames]], [selectedCountry]);
    const routeFilter = useMemo(() => ['in', 'SEGMENT_ID', selectedSegment], [selectedSegment]);


    useEffect(() => {
        if (activeSource == "originCities") {
            setOpacity(1)
        }

        else setOpacity(0)
    })
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
                    attributionControl={false}
                    interactiveLayerIds={activeSource === "originCities" ? ['migration-buffer', "hoverable", "cities"] :
                        activeSource ? ['migration-buffer', "hoverable"] : []}
                    zoom={persepctive.zoom}
                    mapStyle={mapStyle}
                    ref={mapRef}
                    doubleClickZoom={false}
                    onMouseMove={onHover}
                    dragPan={false}
                    scrollZoom={false}
                >
                    {(selectedCountry && activeSource === 'originCities') && (
                        <Tooltip selectedCountry={selectedCountry} hoverInfo={hoverInfo} data={risks} />
                    )}
                    {(selectedCity && activeSource === 'originCities') && (
                        <CityTip hoverInfo={cityInfo} data={risks} />
                    )}
                    {(selectedCountry && activeSource === 'overallRoutes') && (
                        <Tooltip selectedCountry={selectedCountry} hoverInfo={hoverInfo} data={risks} />
                    )}
                    {(selectedCountry && activeSource === 'extremeHeat') && (
                        <Tooltip selectedCountry={selectedCountry} hoverInfo={hoverInfo} data={risks} />
                    )}
                    {renderSource(activeSource, risks)}

                    <Layer {...highlightLayer} filter={filter} />
                    <Layer {...layersObject["countryFill"]} filter={highlightFilter} />
                    <Layer {...layersObject["countryLayer"]} />
                    <Layer {...layersObject["migrationRouteStyle"]} lineJoin="round" />
                    <Layer {...layersObject["migrationHover"]} lineJoin="round" filter={routeFilter} />
                    <Layer {...layersObject["migrationBuffer"]} />
                    <Layer {...layersObject["countryBorderStyle"]} />
                    <Layer {...layersObject["cityStyle"]}
                        paint={{
                            ...layersObject["cityStyle"].paint,
                            "circle-opacity": opacity,

                        }} />

                    {activeSource && (<Layer {...layersObject["migrationHover"]} lineJoin="round" filter={routeFilter} />)}

                </Map>
            </div >
        </RouteContext.Provider>
    )
}











