import { Popup } from 'react-map-gl'
import { Stack } from 'react-bootstrap'
import styles from './../../styles/Tooltip.module.css'
import { v4 as uuidv4 } from 'uuid'
import TransectTip from './transecttip'


export default function MapPopup({ hoverInfo, type, ...regionDataProps }) {

    <Popup style={{
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column-reverse',
    }}
        longitude={hoverInfo.longitude}
        latitude={hoverInfo.latitude}
        offset={[0, 175]}
        anchor="center"
        closeButton={false}
        className="county-info"
    >
        {type === "country" && (
            <TransectTip hoverInfo={regionDataProps} />
        )}
        {type === "city" && (
            <TransectTip hoverInfo={regionDataProps} />
        )}
        {type === "transect" && (
            <TransectTip hoverInfo={regionDataProps} />
        )}
    </Popup>

}