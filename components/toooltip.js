import { Popup } from 'react-map-gl'
import { Stack } from 'react-bootstrap'
import styles from '../styles/Tooltip.module.css'
import { v4 as uuidv4 } from 'uuid'


export default function Tooltip({ selectedCountry, hoverInfo }) {

    return (
        <Popup style={{
            width: '240px',
            display: 'flex',
            flexDirection: 'column-reverse',
        }}
            longitude={hoverInfo.longitude}
            latitude={hoverInfo.latitude}
            offset={[0, -10]}
            anchor={'bottom'}
            closeButton={false}
            className="county-info"
        >
            <div className={styles.tooltip}>
                <span style={{ fontWeight: 'bold' }}>{selectedCountry}</span>
                <div className={styles['tooltipInfo body-2']}>
                    <Stack>
                        <span>xxx,xxx {selectedCountry} mirgants in Libya</span>
                        <span>xxx,xxx km from start to end</span>
                    </Stack>
                    <Stack style={{ marginTop: '0.5rem' }}>
                        <span>Top origin cities of {selectedCountry} migrants</span>
                        {['City A', 'City B', 'City C', 'City D'].map((entries) => {
                            return <Separator info1={entries} info2="xx%" key={uuidv4()}>{entries}</Separator>
                        })}
                    </Stack>
                </div>
                <span style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>IPC Food Security</span>
                <div
                    style={{
                        width: '100%',
                        display: 'flex',
                        position: 'relative',
                        flexDirection: 'column',
                        justifyContent: 'flex-end'
                    }}>
                    {['Food Secure', 'Moderately food insecure', 'Serverly food insecure'].map((entries) => {
                        return <Separator info1={entries} info2="xx%" key={uuidv4()}>{entries}</Separator>
                    })}
                </div>
            </div >
        </Popup>
    )
}

function Separator({ info1, info2 }) {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between"
            }}>
            <span>{info1}</span>
            <span>{info2}</span>
        </div>
    )
}