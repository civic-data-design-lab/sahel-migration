import type { FillLayer, LineLayer, HeatmapLayer } from 'react-map-gl'



const BORDER_COlOR = '#ffffff'
const COUNTRY_FILL_COLOR = '#f2f2f2'
const TRANSITION_TIME = 3000

const MAX_ZOOM_LEVEL = 9;

const DOT_COLOR_SCALE = {
    light: 'hsl(16, 72%, 95%)',
    medium: 'hsl(16, 72%, 75%)',
    deep: 'hsl(16, 72%, 65%)',
    bold: 'hsl(16, 72%, 55%)',
}

export default function stylesObject(activeSource) {
    const countryLayer: FillLayer = {
        id: 'hoverable',
        type: 'fill',
        source: 'selected-countries',
        "source-layer": 'WA_SelectedCountries2-3495m1',
        paint: {
            'fill-outline-color': 'rgba(255,255,255,1)',
            'fill-color': 'rgba(0,0,0,0.1)'
        }
    };

    const highlightLayer: LineLayer = {
        id: 'countires-highlighted',
        type: 'line',
        "source-layer": 'WA_SelectedCountries2-3495m1',
        source: 'selected-countries',
        paint: {
            'line-color': '#ffffff',
            'line-width': 3,
            'line-opacity-transition': {
                delay: 1000,
                duration: 9000
            }
        }
    }

    const countryBorderStyle = {
        'id': 'country-outline',
        'type': 'line',
        "source-layer": 'WA_SelectedCountries2-3495m1',
        'source': 'selected-countries',
        'paint': {
            'line-color': BORDER_COlOR,
            'line-width': 1
        },
        "transition": {
            "duration": 300,
            "delay": 0
        }
    };

    const countryLabels = {
        'id': 'poi-labels',
        "source-layer": 'WA_SelectedCountries2-3495m1',
        'source': 'selected-countries',
        'type': 'symbol',
        'layout': {
            'text-field': ['get', 'ADM0_NAME'],
            'text-font': ['Overpass Black'],
            'text-transform': 'uppercase'

        },
    }

    const routeStyle: LineLayer = {
        id: 'routes',
        type: 'line',
        'source-layer': 'route_lagos-tripoli-9p3vru',
        source: 'overall-routes',
        paint: {
            'line-color': DOT_COLOR_SCALE.bold,
            'line-width': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                7,
                3
            ],
            'line-opacity': 0.75,
            'line-opacity-transition': {
                delay: 1000,
                duration: 9000
            },
            'line-width-transition': {
                delay: 0,
                duration: 2000

            }
        }
    }

    const routeHighlightLayer: LineLayer = {
        id: 'route-highlighted',
        'source-layer': 'route_lagos-tripoli-9p3vru',
        type: 'line',
        source: 'overall-routes',
        paint: {
            'line-color': '#ffffff',
            'line-width': 4,
            'line-opacity': 0,
            'line-opacity-transition': {
                delay: 1000,
                duration: 1000
            }
        },
    }

    const extremeHeatLayer: FillLayer = {
        id: 'extreme-heat',
        type: 'fill',
        source: 'extreme-heat',
        "source-layer": 'heat_vectorized-0z0yzb',
        paint: {
            'fill-color': [
                "interpolate",
                ["linear"],
                ["get", "heat_kelvin"],
                293.42949677,
                "hsla(242, 92%, 51%, 0.8)",
                304,
                "hsla(330, 88%, 52%, 0.8)",
                311.02666728,
                "hsla(37, 88%, 52%, 0.8)"
            ],
            'fill-opacity': ['feature-state', 'opacity'],
            "fill-opacity-transition": { duration: 3000 }
        }
    }

    const cityStyle = {
        'id': 'cities',
        'type': 'circle',
        'source-layer': 'IFPRI_Libya_origin-cities-98ikdw',
        'source': 'origin-cities',
        'paint': {
            'circle-color': [
                'step',
                ['get', 'count'],
                DOT_COLOR_SCALE.light,
                1,
                DOT_COLOR_SCALE.medium,
                5,
                DOT_COLOR_SCALE.deep,
                22,
                DOT_COLOR_SCALE.bold
            ],
            'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                1,
                ['*', ['^', ['get', 'count'], 0.5], 0.75],
                3.65,
                ['*', ['^', ['get', 'count'], 0.25], 6]
            ],
            'circle-stroke-color': 'white',
            'circle-stroke-width': 1,
        },
    };



    const desktopPerspective = {
        lng: 3,
        lat: 25,
        zoom: 3.65
    }



    const layersObject = {
        'routeStyle': routeStyle,
        'countryLabels': countryLabels,
        'cityStyle': cityStyle,
        'countryBorderStyle': countryBorderStyle,
        'countryLayer': countryLayer,
        'highlightLayer': highlightLayer,
        'routeHighlightLayer': routeHighlightLayer,
        'extremeHeatLayer': extremeHeatLayer
    }

    return {
        layersObject,
        highlightLayer,
        desktopPerspective
    }
}

