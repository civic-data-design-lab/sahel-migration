import { bounceIn } from '@popmotion/easing';
import { SymbolLayer } from 'mapbox-gl';
import type { FillLayer, LineLayer, HeatmapLayer } from 'react-map-gl';

const BORDER_COlOR = '#ffffff';
const TRANSPARENT = 'rgba(0,0,0,0)';
const COUNTRY_FILL_COLOR = '#f2f2f2';
const TRANSITION_TIME = 3000;

const MAX_ZOOM_LEVEL = 9;

const DOT_COLOR_SCALE = {
  light: '#FCDED3',
  medium: '#F9BDA7',
  deep: '#F79C7C',
  bold: '#F15A24',
};

export default function stylesObject(activeSource) {
  const countryLayer: FillLayer = {
    id: 'hoverable',
    type: 'fill',
    source: 'selected-countries',
    'source-layer': 'WA_SelectedCountries2-3495m1',
    paint: {
      // 'fill-outline-color': 'rgba(255,255,255,1)',
      'fill-color': 'rgba(255,255,255,0)',
    },
  };

  const highlightLayer: LineLayer = {
    id: 'countires-highlighted',
    type: 'line',
    'source-layer': 'WA_SelectedCountries2-3495m1',
    source: 'selected-countries',
    paint: {
      'line-color': '#ffffff',
      'line-width': 3,
      'line-opacity-transition': {
        delay: 1000,
        duration: 9000,
      },
    },
  };
  const countryFill: FillLayer = {
    id: 'country-fill',
    type: 'fill',
    'source-layer': 'WA_SelectedCountries2-3495m1',
    source: 'selected-countries',
    paint: {
      'fill-color': 'rgba(255,255,255,0.5)',
    },
  };

  const countryBorder: LineLayer = {
    id: 'border',
    type: 'line',
    'source-layer': 'WA_SelectedCountries2-3495m1',
    source: 'selected-countries',
    paint: {
      'line-color': 'white',
      'line-width': [
        'case',
        ['match', ['get', 'ADM0_NAME'], ['Libya', "Côte d'Ivoire", 'Benin'], false, true],
        2,
        0,
      ],
    },
  };

  const migrationRouteStyle: LineLayer = {
    id: 'migration',
    type: 'line',
    'source-layer': 'transect-segments',
    source: 'migration-routes',
    paint: {
      'line-color': [
        'interpolate',
        ['linear'],
        ['get', 'risks_tota'],
        21.625999450683594,
        '#f9bda7',
        98.1,
        '#f79c7c',
        148,
        '#f47b50',
        228,
        '#f15a24',
        281,
        '#b5441b',
        327.4641418457031,
        '#792d12',
      ],
      'line-width': [
        'interpolate',
        ['linear'],
        ['get', 'risks_tota'],
        21.625999450683594,
        2,
        327.4641418457031,
        12,
      ],
    },
    layout: {
      'line-cap': 'round',
    },
  };
  const migrationHover: LineLayer = {
    id: 'migration-hover',
    type: 'line',
    'source-layer': 'route-buffer-a8wlk1',
    source: 'route-buffer',
    paint: {
      'line-color': 'white',
      'line-width': 2,
    },
    layout: {
      'line-cap': 'round',
    },
  };

  const migrationBuffer: LineLayer = {
    id: 'migration-buffer',
    type: 'line',
    'source-layer': 'transect-segments',
    source: 'migration-routes',
    paint: {
      'line-color': 'red',
      'line-width': 35,
      'line-opacity': 0,
    },
  };

  const countryOverlay: FillLayer = {
    id: 'overlay',
    type: 'fill',
    'source-layer': 'country_boundaries',
    source: 'country-overlay',
    paint: {
      'fill-color': 'hsl(0, 20%, 100%)',
      'fill-opacity-transition': {
        duration: 2000,
      },
      'fill-opacity': 0.5,
    },
  };

  const routeStyle: LineLayer = {
    id: 'routes',
    type: 'line',
    'source-layer': 'route_lagos-tripoli-9p3vru',
    source: 'overall-routes',
    paint: {
      'line-color': DOT_COLOR_SCALE.bold,
      'line-width': ['case', ['boolean', ['feature-state', 'hover'], false], 7, 3],
      'line-opacity': 0.75,
      'line-opacity-transition': {
        delay: 1000,
        duration: 9000,
      },
      'line-width-transition': {
        delay: 0,
        duration: 2000,
      },
    },
  };

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
        duration: 1000,
      },
    },
  };

  const nonMigrantCountries: FillLayer = {
    id: 'non-mgrant',
    type: 'fill',
    source: 'minor-countries',
    'source-layer': 'place_label',
  };

  const cityStyle = {
    id: 'cities',
    type: 'circle',
    'source-layer': 'IFPRI_Libya_origin-cities-98ikdw',
    source: 'origin-cities',
    paint: {
      'circle-color': [
        'step',
        ['get', 'count'],
        DOT_COLOR_SCALE.light,
        1,
        DOT_COLOR_SCALE.medium,
        5,
        DOT_COLOR_SCALE.deep,
        10,
        DOT_COLOR_SCALE.bold,
      ],
      'circle-opacity-transition': {
        duration: 750,
      },

      'circle-radius': [
        'interpolate',
        ['linear'],
        ['zoom'],
        1,
        ['*', ['^', ['get', 'count'], 0.5], 0.75],
        3.65,
        ['*', ['^', ['get', 'count'], 0.25], 6],
      ],
    },
  };

  const minorCountryLabel: SymbolLayer = {
    id: 'minor-labels',
    type: 'symbol',
    source: 'minor-countries',
    'source-layer': 'place_label',
    layout: {
      'text-field': [
        'match',
        ['get', 'name_en'],
        [
          'Senegal',
          'Sierra Leone',
          'Guinea',
          'Guinea-Bissau',
          'Gambia',
          'Benin',
          'Liberia',
          'Burkina Faso',
          'Ivory Coast',
        ],
        ['coalesce', ['get', 'name']],
        '',
      ],
      'text-font': ['Inter Bold', 'Arial Unicode MS Regular'],
      'text-size': 14,
    },
    paint: {
      'text-color': '#463C35',
    },
  };
  const majorCountryLabel: SymbolLayer = {
    id: 'major-labels',
    type: 'symbol',
    source: 'minor-countries',
    'source-layer': 'place_label',
    layout: {
      'text-field': [
        'match',
        ['get', 'name_en'],
        ['Nigeria', 'Mali', 'Libya', 'Ghana', 'Niger', 'Chad'],
        ['coalesce', ['get', 'name_en'], ['get', 'name']],
        '',
      ],
      'text-font': ['Inter Bold', 'Arial Unicode MS Regular'],
      'text-size': 14,
    },
    paint: {
      'text-color': '#463C35',
    },
  };

  const desktopPerspective = {
    lng: -10,
    lat: 20,
    zoom: 3.7,
  };

  const layersObject = {
    routeStyle: routeStyle,
    countryOverlay: countryOverlay,
    cityStyle: cityStyle,
    countryBorder: countryBorder,
    countryLayer: countryLayer,
    countryFill: countryFill,
    highlightLayer: highlightLayer,
    routeHighlightLayer: routeHighlightLayer,
    nonMigrantCountries: nonMigrantCountries,
    migrationRouteStyle: migrationRouteStyle,
    migrationHover: migrationHover,
    migrationBuffer: migrationBuffer,
    majorCountryLabel: majorCountryLabel,
    minorCountryLabel: minorCountryLabel,
  };

  return {
    layersObject,
    highlightLayer,
    desktopPerspective,
  };
}
