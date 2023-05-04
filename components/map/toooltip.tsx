import { Popup } from 'react-map-gl'
import { Stack } from 'react-bootstrap'
import styles from './../../styles/Tooltip.module.css'
import { v4 as uuidv4 } from 'uuid'


export default function Tooltip({ selectedCountry, hoverInfo, data }) {
    const surveyData = data && data.migrantData
    const countryData = surveyData.find((country) => country.countryId == selectedCountry)
    const nationalMigrantCount = (countryData && countryData.migrantCount) || 0
    const totalSurveyed = 347
    const countryText = `of all migrants surveyed in Libya come from`
    const distanceText = `XXXX.XX km to Tripoli`

    return (
        <Popup style={{
            maxWidth: '400px',
            display: 'flex',
            flexDirection: 'column-reverse',
        }}
            longitude={hoverInfo.longitude}
            latitude={hoverInfo.latitude}
            offset={[100, -200]}
            anchor="center"
            closeButton={false}
            className="county-info"
        >
            <div className={styles.tooltip}>
                <div className={styles.city}>
                    <h4 className={styles.header}>Migrants from {selectedCountry}</h4>
                    <InfoBox
                        left={`${Math.floor(nationalMigrantCount * 100 / totalSurveyed)}%`}
                        text={countryText}
                        region={selectedCountry}
                        small={false}
                        bold={true}
                        squeeze={false}
                        align={'flex-start'}
                    />
                    <div
                        style={{
                            width: '100%',
                            borderBottom: '1px solid #A3A3A3',
                            margin: '0.5rem 0'

                        }}
                    ></div>
                    <div style={{
                        display: 'flex',
                        gap: '0.25rem',
                        flexDirection: 'column'
                    }}>
                        <h5
                            className={styles.subtitle}
                        >Top Origin Cities</h5>
                        <InfoBox
                            left={'City 1'}
                            text={distanceText}
                            region={''}
                            align={'space-between'}
                            small={true}
                            squeeze={false}
                            bold={true}
                        />
                        <InfoBox
                            left={`XX%`}
                            text={countryText}
                            region={selectedCountry}
                            small={false}
                            bold={false}
                            squeeze={true}
                            align={'flex-start'}
                        />
                        <InfoBox
                            left={'City 2'}
                            text={distanceText}
                            region={''}
                            align={'space-between'}
                            small={true}
                            squeeze={false}
                            bold={true}
                        />
                        <InfoBox
                            left={`XX%`}
                            text={countryText}
                            region={selectedCountry}
                            small={false}
                            bold={false}
                            squeeze={true}
                            align={'flex-start'}
                        />
                    </div>

                </div>
            </div >
        </Popup>
    )
}

function InfoBox({ left, text, region, small, bold, align, squeeze }) {
    return (
        <div
            className={styles.infoBox}
            style={{

                ['--alignment' as any]: align || 'flex-start',
                ['--paddingFactor' as any]: squeeze ? '1rem' : '0.5rem'
            }}>
            {left &&
                (<h4
                    style={{ ['--weight' as any]: bold ? 'bold' : 'initial' }}
                >{left}</h4>)}
            <p
                style={{ ['--size' as any]: small ? '12px' : '0.75rem' }}
            >{text} <span style={{ fontWeight: '700' }}>{region}</span> </p>
        </div>
    )
}

