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
import Tooltip from './toooltip';
import CityTip from './citytip';
import RouteTip from './routetip';
import { SectionContext } from './../../pages';

mapboxgl.accessToken =
    'pk.eyJ1IjoibWl0Y2l2aWNkYXRhIiwiYSI6ImNpbDQ0aGR0djN3MGl1bWtzaDZrajdzb28ifQ.quOF41LsLB5FdjnGLwbrrg';

export const RouteContext = createContext({
    feature: null,
    point: null,
    setFeature: () => { },
    setPoint: () => { },
});

export const PointerContext = createContext({
    pointerCoords: { posX: 0, posY: 0 },
    setCoordinates: (() => { })
})

export default function MapBox({ activeSource, risks, tipData, journeys }) {
    const { width } = useWindowSize()
    const [mapStyle, setMapStyle] = useState('mapbox://styles/mitcivicdata/cld132ji3001h01rn1jxjlyt4')
    const [hoverInfo, setHoverInfo] = useState(null);
    const [cityInfo, setCityInfo] = useState(null);
    const [pointerCoords, setCoordinates] = useState({ posX: 0, posY: 0 })
    const pointerPosValue = { pointerCoords, setCoordinates }
    const [routeInfo, setRouteInfo] = useState(null);
    const [feature, setFeature] = useState(null)
    const [point, setPoint] = useState(null)
    const routeValue = { feature, point, setFeature, setPoint }

    const { layersObject, highlightLayer } = stylesObject(activeSource)
    const { currentSection, setSection } = useContext(SectionContext)
    const [featureOpacity, setFeatureOpacity] = useState({
        countryBorder: 1,
        originCities: 0,
        transect: 0,

    })

    let getMousePos = (event) => {
        setCoordinates({ posX: event.pageX, posY: event.pageY })
        console.log(containerRef.current.offsetWidth)
    };

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


    const mapRef = useRef(null)
    const containerRef = useRef(null)
    const perspective = useMemo(() => computePerspective(width), [width])


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
        setSection({
            index: region && region.properties.segement_i,
            routeId: region && region.properties.segement_i,
        });

        setRouteInfo({
            longitude: event.lngLat.lng,
            latitude: event.lngLat.lat,
            risks: [
                {
                    name: 'Reported Violence',
                    riskLevel: 1,
                },
                {
                    name: 'Conflict Events',
                    riskLevel: region && region.properties.risk_acled,
                },
                {
                    name: 'Food Insecurity',
                    riskLevel: region && region.properties.risk_food,
                },
                {
                    name: 'Reliance on Smugglers',
                    riskLevel: region && region.properties.Risk_smugg,
                },
                {
                    name: 'Remoteness',
                    riskLevel: region && region.properties.risk_remot,
                },
                {
                    name: 'Heat Exposure',
                    riskLevel: region && region.properties.risk_heat,
                },
            ],
            totalRisk: region && region.properties.risks_tota,
            routeId: region && region.properties.segement_i,
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
            countryName: region && region.properties.ADM0_NAME,
        });
    }, []);

    const selectedCountry = (hoverInfo && hoverInfo.countryName) || '';
    const selectedCity = (cityInfo && cityInfo.cityName) || '';
    // const selectedRoute = (routeInfo && routeInfo.route) || '';
    const selectedSegment = (currentSection && currentSection.routeId) || '';
    const countryNames = !selectedCountry
        ? []
        : ['Ghana', 'Mali', 'Nigeria', 'Niger', 'Chad'].filter((elem) => {
            return elem !== selectedCountry;
        });
    const filter = useMemo(() => ['in', 'ADM0_NAME', selectedCountry], [selectedCountry]);
    const highlightFilter = useMemo(
        () => ['in', ['get', 'ADM0_NAME'], ['literal', countryNames]],
        [selectedCountry]
    );
    const routeFilter = useMemo(() => ['in', 'SEGMENT_ID', selectedSegment], [selectedSegment]);


    useEffect(() => {

        const opacitySwicth = {
            "overallRoutes": { ...objectMap(featureOpacity, () => 0), countryBorder: 1 },
            "originCities": { ...objectMap(featureOpacity, () => 1), transect: 0 },
            "transectSegment": { ...objectMap(featureOpacity, () => 0), transect: 1 },
            "null": featureOpacity,
            "undefined": featureOpacity
        }
        if (typeof featureOpacity === "object") setFeatureOpacity(opacitySwicth[activeSource])

        if (mapRef.current) {
            mapRef.current.on('load', () => {
                mapRef.current.resize()
            })

            mapRef.current.on('click', 'migration', (e) => {
                const routeFeature = e.features && e.features[0].properties // grabs a single feature from the clicked route segment
                const routeId = routeFeature.segement_i
                const journey = journeys[routeId] // selects journey url from url list (index given by routeId)
                if (journey) window.location.href = '/journeys/' + journey.id
            }
            )
        }

    }, [activeSource])
    return (
        <RouteContext.Provider value={routeValue}>
            <PointerContext.Provider value={pointerPosValue}>
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
                            activeSource === "originCities" ? ["hoverable", "cities"] :
                                activeSource === "transectSegment" ? ["migration-buffer", "hoverable"] :
                                    activeSource ? ["hoverable"] : []}
                        zoom={perspective.zoom}
                        mapStyle={mapStyle}
                        ref={mapRef}
                        doubleClickZoom={false}
                        onMouseMove={onInfo}
                        dragPan={false}
                        dragRotate={false}
                        scrollZoom={false}
                    >
                        {(selectedCountry && activeSource === 'originCities') && (
                            <Tooltip selectedCountry={selectedCountry} hoverInfo={hoverInfo} data={risks} cityData={tipData} />
                        )}
                        {(selectedCity && activeSource === 'originCities') && (
                            <CityTip hoverInfo={cityInfo} data={risks} />
                        )}
                        {(selectedCountry && activeSource === 'overallRoutes') && (
                            <Tooltip selectedCountry={selectedCountry} hoverInfo={hoverInfo} data={risks} cityData={tipData} />
                        )}
                        {(selectedCountry && activeSource === 'transectSegment') && (
                            <Tooltip selectedCountry={selectedCountry} hoverInfo={hoverInfo} data={risks} cityData={tipData} />
                        )}
                        {(selectedSegment && activeSource === 'transectSegment') && (
                            <RouteTip hoverInfo={routeInfo} />
                        )}
                        {renderSource(activeSource, risks)}

                        <Layer {...highlightLayer} filter={filter} />
                        <Layer {...layersObject["countryFill"]} filter={highlightFilter} />
                        <Layer {...layersObject["countryLayer"]} />
                        <Layer {...layersObject["overallRoutes"]} />
                        {width > 600 && (<Layer {...layersObject["minorCountryLabel"]} />)}
                        {width > 600 && (<Layer {...layersObject["majorCountryLabel"]} />)}
                        <Layer {...layersObject["migrationRouteStyle"]}
                            lineJoin="round"
                            paint={{
                                ...layersObject["migrationRouteStyle"].paint,
                                "line-opacity": featureOpacity && featureOpacity.transect,

                            }}

                        />
                        <Layer {...layersObject["migrationHover"]} lineJoin="round" filter={routeFilter} />
                        <Layer {...layersObject["cityStyle"]}
                            paint={{
                                ...layersObject["cityStyle"].paint,
                                "circle-opacity": featureOpacity && featureOpacity.originCities,

                            }} />
                        <Layer {...layersObject["countryBorder"]}
                            paint={{
                                ...layersObject["countryBorder"].paint,
                                "line-opacity": featureOpacity && featureOpacity.countryBorder,

                            }}

                        />
                        <Layer {...layersObject["migrationBuffer"]} />

                        {activeSource && (<Layer {...layersObject["migrationHover"]} lineJoin="round" filter={routeFilter} />)}

                    </Map>
                </div >
            </PointerContext.Provider>
        </RouteContext.Provider>
    )
}
