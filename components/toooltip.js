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
                <h2>{selectedCountry}</h2>
                <div className={styles.tooltipInfo}>
                    <Stack>
                        <span>xxx,xxx {selectedCountry} mirgants in Libya</span>
                        <span>xxx,xxx km from start to end</span>
                    </Stack>
                    <Stack style={{ marginTop: '0.5rem' }}>
                        <span>Top origin cities of {selectedCountry} migrants</span>
                        {['15%', '14%', '13%', '12%'].map((entries, i) => {
                            return <span key={uuidv4()}>{entries} {i}</span>
                        })}
                    </Stack>
                </div>
                <span style={{ marginTop: '0.5rem' }}>IPC Food Security in Origin Country</span>
                <div className={styles.bar}>
                    <div style={{ flexBasis: '70%', backgroundColor: '#B9BF8B' }}></div>
                    <div style={{ flex: 1, backgroundColor: '#EADD97' }}></div>
                    <div style={{ flex: 1, backgroundColor: '#DF9B6F' }}></div>
                </div>
                <div style={{ width: '100%', display: 'flex', position: 'relative', justifyContent: 'flex-end' }}>
                    <span style={{ textAlign: 'right', right: '0', width: '70%' }}>Moderatel or Serverly Food Insecure</span>
                </div>
            </div >
        </Popup>
    )
}