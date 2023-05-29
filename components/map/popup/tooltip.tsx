import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Popup } from 'react-map-gl'
import CountryTip from './countrytip'
import CityTip from './citytip'
import RouteTip from './routetip'
import { ScreenContext } from './../mapBox'


export default function ToolTip({ location, type, regionDataProps }) {
    const { pointerCoords, setCoordinates, containerDimensions, setDimensions } = useContext(ScreenContext)
    const { posX, posY } = pointerCoords
    const { width, height } = containerDimensions
    const offset = {
        "city": [-150, -100],
        "country": [-150, -200],
        "route": [-150, -100],
        "null": [150, -150],
        "undefined": [150, -150],
    }
    const offsetX = useMemo(() => {
        return Math.sign((posX - width * 0.4) - (width - width * 0.4) / 2) * offset[type][0]
    }, [posX])
    const offsetY = useMemo(() => {
        return Math.sign(posY - (height / 2)) * offset[type][1]
    }, [posY])

    return (

        <Popup style={{
            maxWidth: '400px',
            display: 'flex',
            flexDirection: 'column-reverse',
        }}
            longitude={location.longitude}
            latitude={location.latitude}
            offset={[offsetX, offsetY]}
            anchor="center"
            closeButton={false}
            className="county-info"
        >
            {type === "country" && (
                <CountryTip regionData={regionDataProps} />
            )}
            {type === "city" && (
                <CityTip regionData={regionDataProps} />
            )}
            {type === "route" && (
                <RouteTip regionData={regionDataProps} />
            )}
        </Popup>
    )

}