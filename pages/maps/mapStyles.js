
export const BORDER_COlOR = '#ffffff'
export const COUNTRY_FILL_COLOR = '#f2f2f2'
export const DOT_COLOR_SCALE = {
    light: 'hsl(16, 72%, 95%)',
    medium: 'hsl(16, 72%, 75%)',
    deep: 'hsl(16, 72%, 65%)',
    bold: 'hsl(16, 72%, 55%)',
}

const TRANSITION_TIME = 3000

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