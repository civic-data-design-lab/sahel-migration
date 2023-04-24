import type { LineLayer } from 'react-map-gl'
export default function routePaths() {
    const styles = {
        paint: {
            // 'line-color': 'hsl(16, 88%, 54%)',
            'line-color': 'hsl(16, 72%, 55%)',
            'line-opacity': 0.7,
            'line-width': 3,
        }

    }
    const nra_path: LineLayer = {
        ...styles,
        type: 'line',
        id: 'nra_path',
        source: 'nra',
    }
    const mali_path: LineLayer = {
        ...styles,
        type: 'line',
        id: 'mali_path',
        source: 'mali',
    }
    const chad_path: LineLayer = {
        ...styles,
        type: 'line',
        id: 'chad_path',
        source: 'chad',
    }
    const nir_path: LineLayer = {
        ...styles,
        type: 'line',
        id: 'nir_path',
        source: 'nir',
    }
    const ghan_path: LineLayer = {
        ...styles,
        type: 'line',
        id: 'ghan_path',
        source: 'ghan',
    }

    const pathsObject = {
        "nra-path": nra_path,
        "ghan-path": ghan_path,
        "nir-path": nir_path,
        "mali-path": mali_path,
        "chad-path": chad_path,
    }

    return {
        pathsObject
    }
}