import { Popup } from 'react-map-gl'
import { Stack } from 'react-bootstrap'
import styles from './../../styles/Tooltip.module.css'
import { v4 as uuidv4 } from 'uuid'


export default function CityTip({ hoverInfo, data }) {
    const surveryData = data && data.migrantData
    const selectedCity = (hoverInfo && hoverInfo.cityName) || '';
    let originCountry = (hoverInfo && hoverInfo.countryName) || '';

    if (originCountry === 'Sierr') originCountry = 'Sierra Leone'
    if (originCountry === 'Côt') originCountry = "Côte d'Ivoire"
    if (originCountry === 'Guine') originCountry = "Guinea Bissau"
    if (originCountry === 'Burkin') originCountry = "Burkina Faso"

    const countryData = surveryData.find((country) => country.countryId == originCountry)
    const nationalMigrantCount = (countryData && countryData.migrantCount) || 0
    const cityMigrantCount = (hoverInfo && hoverInfo.migrantCount) || 0
    const totalSurveyed = 347



    const cityText = `of ${originCountry} migrants surveyed in Libya come from`
    const countryText = `${Math.floor(nationalMigrantCount * 100 / totalSurveyed)}% of all migrants surveyed in Libya come from`
    console.log(Math.floor(nationalMigrantCount * 100 / totalSurveyed))

    return (
        <Popup style={{
            maxWidth: '400px',
            display: 'flex',
            flexDirection: 'column-reverse',
        }}
            longitude={hoverInfo.longitude}
            latitude={hoverInfo.latitude}
            offset={[0, -150]}
            anchor={'center'}
            closeButton={false}
            className="county-info"
        >
            <div className={styles["tooltip"]}>
                <div className={styles.city}>
                    <h4 className={styles.header}>{selectedCity}, {originCountry}</h4>
                    <InfoBox
                        percentage={Math.floor(cityMigrantCount * 100 / nationalMigrantCount)}
                        text={cityText}
                        region={selectedCity}
                        small={false}
                        bold={true}
                    />
                    <InfoBox
                        percentage={null}
                        text={countryText}
                        region={originCountry}
                        small={true}
                        bold={false}
                    />

                </div>
            </div >
        </Popup>
    )
}

function ToolTip({ hoverInfo }) {
    return (
        <Popup style={{
            maxWidth: '400px',
            display: 'flex',
            flexDirection: 'column-reverse',
        }}
            longitude={hoverInfo.longitude}
            latitude={hoverInfo.latitude}
            offset={[0, -150]}
            anchor={'center'}
            closeButton={false}
            className="county-info"
        >

        </Popup>

    )
}


function InfoBox({ percentage, text, region, small, bold }) {
    return (
        <div className={styles.infoBox}>
            {percentage &&
                (<h4
                    style={{ ['--weight' as any]: bold ? 'bold' : 'initial' }}
                >{percentage}%</h4>)}
            <p
                style={{ ['--size' as any]: small ? '12px' : '0.875rem' }}
            >{text} <span style={{ fontWeight: 'bold' }}>{region}</span> </p>
        </div>
    )
}

