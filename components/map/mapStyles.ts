import { bounceIn } from '@popmotion/easing'
import type { FillLayer, LineLayer, HeatmapLayer } from 'react-map-gl'



const BORDER_COlOR = '#ffffff'
const TRANSPARENT = 'rgba(0,0,0,0)'
const COUNTRY_FILL_COLOR = '#f2f2f2'
const TRANSITION_TIME = 3000

const MAX_ZOOM_LEVEL = 9;

const DOT_COLOR_SCALE = {
    light: '#FCDED3',
    medium: '#F9BDA7',
    deep: '#F79C7C',
    bold: '#F15A24',
}

export default function stylesObject(activeSource) {
    const countryLayer: FillLayer = {
        id: 'hoverable',
        type: 'fill',
        source: 'selected-countries',
        "source-layer": 'WA_SelectedCountries2-3495m1',
        paint: {
            // 'fill-outline-color': 'rgba(255,255,255,1)',
            'fill-color': 'rgba(255,255,255,0)'
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
    const countryFill: FillLayer = {
        id: 'country-fill',
        type: 'fill',
        "source-layer": 'WA_SelectedCountries2-3495m1',
        source: 'selected-countries',
        paint: {
            'fill-color': 'rgba(255,255,255,0.5)'
        }
    }

    const libyaSelect = {
        'id': 'libya-select',
        'type': 'line',
        "source-layer": 'WA_SelectedCountries2-3495m1',
        'source': 'selected-countries',
        'paint': {
            'line-color': ['case',
                ['==', ['get', 'ADM0_NAME'], 'Libya'],
                'red',
                'white'],
            'line-width': ['case',
                ['==', ['get', 'ADM0_NAME'], 'Libya'],
                1.5,
                0],
        },
    }

    const countryBorderStyle = {
        'id': 'country-outline',
        'type': 'line',
        "source-layer": 'WA_SelectedCountries2-3495m1',
        'source': 'selected-countries',
        'paint': {
            'line-color': [
                "match",
                ["get", "ADM0_NAME"],
                [
                    "Benin",
                    "Chad",
                    "Côte d'Ivoire",
                    "Ghana",
                    "Mali",
                    "Niger",
                    "Nigeria"
                ],
                "hsl(0, 0%, 100%)",
                "hsla(0, 0%, 100%, 0)"
            ],
        },
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

    const migrationRouteStyle: LineLayer = {
        "id": 'migration',
        "type": 'line',
        'source-layer': 'route-final_split-55pcyx',
        "source": 'migration-routes',
        "paint": {
            'line-color': '#f48532',
            'line-width': 5,
        },
        "layout": {
            "line-cap": 'round'
        }
    }
    const migrationHover: LineLayer = {
        "id": 'migration-hover',
        "type": 'line',
        'source-layer': 'route-final_split-55pcyx',
        "source": 'migration-routes',
        "paint": {
            'line-color': '#74401a',
            'line-width': 5,
        },
        "layout": {
            "line-cap": 'round'
        }
    }

    const migrationBuffer: LineLayer = {
        "id": 'migration-buffer',
        "type": 'line',
        'source-layer': 'route-final_split-55pcyx',
        "source": 'migration-routes',
        "paint": {
            'line-color': 'red',
            'line-width': 15,
            'line-opacity': 0
        }
    }

    const countryOverlay: FillLayer = {
        id: 'overlay',
        type: 'fill',
        "source-layer": 'country_boundaries',
        "source": 'country-overlay',
        "paint": {
            "fill-color": "hsl(0, 20%, 100%)",
            "fill-opacity-transition": {
                duration: 2000
            },
            "fill-opacity": 0.5
        }
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
                10,
                DOT_COLOR_SCALE.bold
            ],
            "circle-opacity-transition": {
                duration: 2000
            },

            'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                1,
                ['*', ['^', ['get', 'count'], 0.5], 0.75],
                3.65,
                ['*', ['^', ['get', 'count'], 0.25], 6]
            ],
        },
    };



    const desktopPerspective = {
        lng: -10,
        lat: 20,
        zoom: 3.7
    }



    const layersObject = {
        'routeStyle': routeStyle,
        'libyaSelect': libyaSelect,
        'countryLabels': countryLabels,
        'countryOverlay': countryOverlay,
        'cityStyle': cityStyle,
        'countryBorderStyle': countryBorderStyle,
        'countryLayer': countryLayer,
        'countryFill': countryFill,
        'highlightLayer': highlightLayer,
        'routeHighlightLayer': routeHighlightLayer,
        'migrationRouteStyle': migrationRouteStyle,
        'migrationHover': migrationHover,
        'migrationBuffer': migrationBuffer,
        'extremeHeatLayer': extremeHeatLayer
    }

    return {
        layersObject,
        highlightLayer,
        desktopPerspective
    }
}

