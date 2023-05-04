import { Popup } from 'react-map-gl'
import { Stack } from 'react-bootstrap'
import styles from './../../styles/Tooltip.module.css'
import { v4 as uuidv4 } from 'uuid'


export default function Tooltip({ selectedCountry, hoverInfo, data, cityData }) {
    const surveyData = data && data.migrantData
    const countryData = surveyData.find((country) => country.countryId == selectedCountry)
    const nationalMigrantCount = (countryData && countryData.migrantCount) || 0
    const totalSurveyed = 347
    const countryText = `of all migrants surveyed in Libya come from`
    const distanceText = ` km to Tripoli`

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const topCities = cityData.filter(country => country.country_origin == selectedCountry).sort((a, b) => b.count - a.count)
    const city1 = {
        count: topCities[0] && topCities[0].count || 0,
        name: topCities[0] && topCities[0].city_origin || " ",
        distance: topCities[0] && topCities[0].total_dist_km.toFixed(1) || 0,
    }

    const city2 = {
        count: topCities[1] && topCities[1].count || 0,
        name: topCities[1] && topCities[1].city_origin || " ",
        distance: topCities[1] && topCities[1].total_dist_km.toFixed(1) || 0,
    }
    console.log(city1)



    return (
        <Popup style={{
            maxWidth: '400px',
            display: 'flex',
            flexDirection: 'column-reverse',
        }}
            longitude={hoverInfo.longitude}
            latitude={hoverInfo.latitude}
            offset={[0, -200]}
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
                            borderBottom: '1.5px solid #A3A3A3',
                            margin: '0.5rem 0'

                        }}
                    ></div>
                    {topCities.length > 0 && (
                        <div style={{
                            display: 'flex',
                            gap: '0.2rem',
                            flexDirection: 'column'
                        }}>

                            <h5
                                className={styles.subtitle}
                            >Top Origin Cities</h5>
                            <InfoBox
                                left={city1.name}
                                text={numberWithCommas(city1.distance) + distanceText}
                                region={''}
                                align={'space-between'}
                                small={true}
                                squeeze={false}
                                bold={true}
                            />
                            <InfoBox
                                left={`${Math.floor(city1.count / nationalMigrantCount * 100)}%`}
                                text={countryText}
                                region={selectedCountry}
                                small={false}
                                bold={false}
                                squeeze={true}
                                align={'flex-start'}
                            />
                            <InfoBox
                                left={city2.name}
                                text={numberWithCommas(city2.distance) + distanceText}
                                region={''}
                                align={'space-between'}
                                small={true}
                                squeeze={false}
                                bold={true}
                            />
                            <InfoBox
                                left={`${Math.floor(city2.count / nationalMigrantCount * 100)}%`}
                                text={countryText}
                                region={selectedCountry}
                                small={false}
                                bold={false}
                                squeeze={true}
                                align={'flex-start'}
                            />
                        </div>
                    )}

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
            >{text} <span style={{ fontWeight: 'bold' }}>{region}</span> </p>
        </div>
    )
}

