import { useEffect, useState } from "react";
import useWindowSize from './useWindowSize'

function zoomFunction(number) {
    const x = number / 100;
    return 0.0801143 * x + 2.72143;
}
function latFunction(number) {
    return 20;
}
function lngFunction(number) {
    const x = number / 100;
    return -0.727878 * x + 5.73398;
}

export default function useMapView() {
    const { width } = useWindowSize()
    const [mapView, setView] = useState({
        zoom: zoomFunction(width),
        lng: lngFunction(width),
        lat: latFunction(width),
    })

    useEffect(() => {
        setView({
            zoom: zoomFunction(width),
            lng: lngFunction(width),
            lat: latFunction(width),
        })

    }, [width])

    return mapView
}