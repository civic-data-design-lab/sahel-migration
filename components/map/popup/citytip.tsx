import { Popup } from 'react-map-gl'
import { Stack } from 'react-bootstrap'
import styles from './../../../styles/Tooltip.module.css'
import { v4 as uuidv4 } from 'uuid'


export default function CityTip({ regionData }) {
    const surveryData = regionData && regionData.migrantData
    const selectedCity = (regionData && regionData.hoveredCity) || '';
    let originCountry = (regionData && regionData.hoveredMigrantCountry) || '';
    if (originCountry === 'Sierr') originCountry = 'Sierra Leone'
    if (originCountry === 'Côt') originCountry = "Côte d'Ivoire"
    if (originCountry === 'Guine') originCountry = "Guinea-Bissau"
    if (originCountry === 'Burkin') originCountry = "Burkina Faso"



    const countryData = surveryData.find((country) => country.countryId == originCountry)
    const nationalMigrantCount = (countryData && countryData.migrantCount) || 0
    const cityMigrantCount = (regionData && regionData.migrantCount) || 0
    const totalSurveyed = 347


    const nationalityLabel = {
        "Benin": "Beninois",
        "Burkina Faso": "Burkinab&Eacute;",
        "Cameroon": "Cameroonian",
        "Chad": "Chadian",
        "C\u00f4te d'Ivoire": "Ivorian",
        "Gambia": "Ghambian",
        "Ghana": "Ghanaian",
        "Guinea": "Guinean",
        "Guinea Bissau": "Bissau-Guinean",
        "Liberia": "Liberian",
        "Libya": "Libyan",
        "Mali": "Malian",
        "Niger": "Nigerien",
        "Nigeria": "Nigerian",
        "Senegal": "Senegalese",
        "Sierra Leone": "Sierra Leonean",
        "Togo": "Togolese"
    }
    const cityText = `of ${nationalityLabel[originCountry]} migrants surveyed in Libya come from`
    const countryText = `${Math.floor(nationalMigrantCount * 100 / totalSurveyed)}% of all migrants surveyed in Libya come from`

    return (
        <div
            className={styles["tooltip"]}
            style={{
                padding: '1.1rem'
            }}
        >
            <div className={styles.city}>
                <h4 className={styles.header}>{selectedCity}, {originCountry}</h4>
                <InfoBox
                    percentage={Math.floor(cityMigrantCount * 100 / nationalMigrantCount)}
                    text={cityText}
                    region={selectedCity}
                    small={false}
                    bold={true}
                    squeeze={true}
                />
                <InfoBox
                    percentage={null}
                    text={countryText}
                    region={originCountry}
                    small={true}
                    bold={false}
                    squeeze={true}
                />

            </div>
        </div >
    )
}

function InfoBox({ percentage, text, region, small, bold, squeeze }) {
    return (
        <div className={styles.infoBox}
            style={{
                ['--paddingFactor' as any]: squeeze ? '1rem' : '0rem'
            }}>
            {percentage &&
                (<h4
                    style={{ ['--weight' as any]: bold ? 'bold' : 'initial' }}
                >{percentage}%</h4>)}
            <p
                style={{ ['--size' as any]: small ? '0.65rem' : '0.75rem' }}
            >{text} <span style={{ fontWeight: 'bold' }}>{region}</span> </p>
        </div>
    )
}

