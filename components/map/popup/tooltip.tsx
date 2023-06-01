import { useContext, useMemo, useEffect, useState } from 'react'
import { Popup } from 'react-map-gl'
import CountryTip from './countrytip'
import CityTip from './citytip'
import RouteTip from './routetip'
import { ScreenContext } from './../mapBox'
import { SectionContext } from '../../../pages'
import styles from './../../../styles/Tooltip.module.css'
import useWindowSize from '../../../hooks/useWindowSize'

function has(obj, key) {
    if (Object.hasOwn(obj, key)) return obj[key]
    return obj[String((Object.hasOwn(obj, key)))]
}

export default function ToolTip({ location, toolType, regionDataProps }) {
    const [visibility, setVisibility] = useState('flex')
    const { pointerCoords, setCoordinates, containerDimensions, setDimensions, mapCenter } = useContext(ScreenContext)
    const { posX, posY } = pointerCoords
    const { width, height } = containerDimensions
    const { width: containerWidth } = useWindowSize()
    const { currentSection, setSection } = useContext(SectionContext)



    const offset = {
        "city": [-150, -100],
        "country": [-150, -200],
        "route": [-150, -100],
        "null": [150, -150],
        "undefined": [150, -150],
        "false": [50, -50],
    }
    let offsetX = useMemo(() => {
        return Math.sign((posX - width * 0.4) - (width - width * 0.4) / 2) * has(offset, toolType)[0]
    }, [posX])
    let offsetY = useMemo(() => {
        return Math.sign(posY - (height / 2)) * has(offset, toolType)[1]
    }, [posY])
    let lat = location.latitude
    let lng = location.longitude

    useEffect(() => {
        if (containerWidth < 600) {
            setTimeout(() => {
                setVisibility('none')
            }, 10000);
        }

    }, [])

    if (containerWidth < 600) {
        [offsetX, offsetY] = [0, 0];
        [lat, lng] = [mapCenter.lat, mapCenter.lng]
    }

    return (
        (!(toolType === "route") || (currentSection.index)) && (
            <Popup style={{
                maxWidth: '400px',
                display: visibility,
                flexDirection: 'column-reverse',
            }}
                longitude={lng}
                latitude={lat}
                offset={[offsetX, offsetY]}
                anchor="center"
                closeButton={false}
                className="county-info"
            >
                {toolType === "country" && (
                    <CountryTip regionData={regionDataProps} />
                )}
                {toolType === "city" && (
                    <CityTip regionData={regionDataProps} />
                )}
                {toolType === "route" && (
                    <RouteTip regionData={regionDataProps} />
                )}
            </Popup>
        )
    )

}