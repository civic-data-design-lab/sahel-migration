import type { FillLayer, LineLayer, HeatmapLayer } from 'react-map-gl'
export const BORDER_COlOR = '#ffffff'
export const COUNTRY_FILL_COLOR = '#f2f2f2'
const TRANSITION_TIME = 3000

const MAX_ZOOM_LEVEL = 9;

export const heatmapLayer: HeatmapLayer = {
    id: 'heatmap',
    maxzoom: MAX_ZOOM_LEVEL,
    type: 'heatmap',
    paint: {
        // Increase the heatmap weight based on frequency and property magnitude
        'heatmap-weight': ['interpolate', ['linear'], ['get', 'mag'], 0, 0, 6, 1],
        // Increase the heatmap color weight weight by zoom level
        // heatmap-intensity is a multiplier on top of heatmap-weight
        'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, MAX_ZOOM_LEVEL, 3],
        // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
        // Begin color ramp at 0-stop with a 0-transparancy color
        // to create a blur-like effect.
        'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0,
            'rgba(33,102,172,0)',
            0.2,
            'rgb(103,169,207)',
            0.4,
            'rgb(209,229,240)',
            0.6,
            'rgb(253,219,199)',
            0.8,
            'rgb(239,138,98)',
            0.9,
            'rgb(255,201,101)'
        ],
        // Adjust the heatmap radius by zoom level
        'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, MAX_ZOOM_LEVEL, 20],
        // Transition from heatmap to circle layer by zoom level
        'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 1, 9, 0]
    }
};

export const DOT_COLOR_SCALE = {
    light: 'hsl(16, 72%, 95%)',
    medium: 'hsl(16, 72%, 75%)',
    deep: 'hsl(16, 72%, 65%)',
    bold: 'hsl(16, 72%, 55%)',
}



export const countryLayer: FillLayer = {
    id: 'hoverable',
    type: 'fill',
    paint: {
        'fill-outline-color': 'rgba(0,0,0,0.1)',
        'fill-color': 'rgba(0,0,0,0.1)'
    }
};

export const highlightLayer: LineLayer = {
    id: 'countires-highlighted',
    type: 'line',
    source: 'hoverable',
    paint: {
        'line-color': '#ffffff',
        'line-width': 3,
        'line-opacity': 0.75,
        'line-opacity-transition': {
            delay: 1000,
            duration: 1000
        }
    },
}

export const countryStyle = {
    'id': 'landuse_park',
    'type': 'fill',
    'paint': {
        'fill-color': COUNTRY_FILL_COLOR,
        'fill-opacity': 0.5
    },
    "transition": {
        "duration": 300,
        "delay": 0
    }
};

export const countryBorderStyle = {
    'id': 'country-outline',
    'type': 'line',
    'paint': {
        'line-color': BORDER_COlOR,
        'line-width': 1
    },
    "transition": {
        "duration": 300,
        "delay": 0
    }
};

export const countryLabels = {
    'id': 'poi-labels',
    'type': 'symbol',
    'layout': {
        'text-field': ['get', 'ADM0_NAME'],
        'text-font': ['Overpass Black'],
        'text-transform': 'uppercase'

    },
}

export const routeStyle = {
    'id': 'routes',
    'type': 'line',
    'paint': {
        'line-color': DOT_COLOR_SCALE.bold,
        'line-width': 3,
    },
    "transition": {
        "duration": TRANSITION_TIME,
        "delay": 0
    }
}

export const cityStyle = {
    'id': 'cities',
    'type': 'circle',
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


export const INITIAL_VIEW_STATE = {
    longitude: 9,
    latitude: 25,
    zoom: 3.65,
    pitch: 0,
    bearing: 0
};

export const desktopPerspective = {
    lng: 3,
    lat: 25,
    zoom: 3.65
}

export const mobilePerspective = {
    lng: 9,
    lat: 25,
    zoom: 2
}


export const citySourceSet = [
    {
        id: 'cities',
        source: ''
    },
    {
        id: 'countries',
        source: ''
    }
]
export const cityLayerSet = [
    {
        id: 'cities',
        type: 'circle',
        paint: {
            'circle-color': [
                'step',
                ['get', 'count'],
                DOT_COLOR_SCALE.light,
                1,
                DOT_COLOR_SCALE.medium,
                10,
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
                ['*', ['^', ['get', 'count'], 0.5], 3]
            ],
            'circle-stroke-color': 'white',
            'circle-stroke-width': 1,
        },
    },
    {
        id: 'selected_country_fill',
        type: 'fill',
        paint: {
            'fill-color': COUNTRY_FILL_COLOR,
            'fill-opacity': 0.5
        }
    }
]