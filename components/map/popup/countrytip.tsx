import React, { useEffect, useState, useContext } from 'react';
import { ScreenContext } from '../mapBox'
import { Popup } from 'react-map-gl'
import { Stack } from 'react-bootstrap'
import styles from './../../../styles/Tooltip.module.css'
import { v4 as uuidv4 } from 'uuid'
import { TEMPORARY_REDIRECT_STATUS } from 'next/dist/shared/lib/constants'
import { handleWebpackExternalForEdgeRuntime } from 'next/dist/build/webpack/plugins/middleware-plugin';
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function CountryTip({ regionData }) {
    const surveyData = regionData && regionData.migrantData
    const selectedCountry = regionData && regionData.selectedCountry
    const countryData = surveyData.find((country) => country.countryId == selectedCountry)
    const nationalMigrantCount = (countryData && countryData.migrantCount) || 0
    const totalSurveyed = 347
    const distanceText = ` km to Tripoli`
    const uniqueCountries = ['Libya', 'Niger']
    const nationalityLabel = {
        "Benin": "Beninois",
        "Burkina Faso": "Burkinab&Eacute;",
        "Chad": "Chadian",
        "C\u00f4te d'Ivoire": "Ivorian",
        "Ghana": "Ghanaian",
        "Guinea": "Guinean",
        "Guninea-Bissau": "Bissau-Guinean",
        "Liberia": "Liberian",
        "Libya": "Libyan",
        "Mali": "Malian",
        "Niger": "Nigerien",
        "Nigeria": "Nigerian",
        "Senegal": "Senegalese",
        "Sierra Leone": "Sierra Leonean"
    }
    const countryText = `of ${nationalityLabel[selectedCountry]} migrants surveyed in Libya come from`
    const topCities = regionData.cityData.filter(country => country.country_origin == selectedCountry).sort((a, b) => b.count - a.count)
    let nationalPctTotal = nationalMigrantCount * 100 / totalSurveyed
    if (nationalPctTotal < 10) nationalPctTotal = Math.round(nationalPctTotal * 10) / 10
    else nationalPctTotal = Math.floor(nationalPctTotal)


    const [city1, city2] = topCities.map(city => {
        const count = city && city.count || 0
        let pctTotal = count / nationalMigrantCount * 100
        if (pctTotal < 1) pctTotal = Math.round(pctTotal * 10) / 10
        else pctTotal = Math.floor(pctTotal)
        const obj = {
            count: count,
            name: city && city.city_origin || " ",
            distance: city && city.total_dist_km.toFixed(1) || 0,
            pctTotal: pctTotal
        }
        return obj
    })
    return (
        <div id="map-tooltip" className={styles.tooltip}>
            {selectedCountry == 'Libya' && (
                <div className={styles.city}>
                    <h4 className={styles.header}>Migrants in Libya</h4>
                    <InfoBox
                        left={`347`}
                        text={"migrants from Economic Community of West African States (ECOWAS) were surveyed in Libya in June–July 2021."}
                        region={''}
                        small={false}
                        bold={true}
                        align={'flex-start'}
                    />
                    <hr />
                    <h5 className={styles.subtitle}>Surveyed Cities</h5>
                    <h4 className={styles.header}>Tripoli</h4>
                    <InfoBox
                        left={`55%`}
                        text={"of West African migrants were surveyed in"}
                        region={"Tripoli"}
                        small={false}
                        bold={true}
                        align={'flex-start'}
                    />
                    <h4 className={styles.header}>Sabha</h4>
                    <InfoBox
                        left={`45%`}
                        text={"of West African migrants were surveyed in"}
                        region={"Sabha"}
                        small={false}
                        bold={true}
                        align={'flex-start'}
                    />
                </div>
            )}
            {selectedCountry == 'Niger' && (
                <div className={`${styles.city} ${styles.nigerTooltip}`}>
                    <h4 className={styles.header}>Migrants from {selectedCountry}</h4>
                    <p style={{ ['--size' as any]: '0.75rem' }}>Migrants originating from Niger are the most numerous West African migrants in Libya (according to IOM data).</p>
                    <p style={{ ['--size' as any]: '0.75rem' }}>Unfortunately, statistics from Niger are not available for this study due to a programming error in the quantitative survey. Secondary research conducted as part of this project suggests that even if migrants from Niger had been included in the sample, the findings would not materially change.</p>
                </div>
            )}
            {!uniqueCountries.includes(selectedCountry) && (
                <div className={styles.city}>
                    <h4 className={styles.header}>Migrants from {selectedCountry}</h4>
                    <InfoBox
                        left={`${nationalPctTotal}%`}
                        text={"of West African migrants surveyed in Libya come from"}
                        region={selectedCountry}
                        small={false}
                        bold={true}
                        align={'flex-start'}
                    />
                    {topCities.length > 0 && (
                        <div style={{
                            display: 'flex',
                            gap: '0.2rem',
                            flexDirection: 'column'
                        }}>
                            <hr />
                            <h5
                                className={styles.subtitle}
                            >Top Origin Cities</h5>
                            <InfoBoxTitle
                                left={city1.name}
                                text={numberWithCommas(city1.distance) + distanceText}
                                region={''}
                                align={'space-between'}
                                small={true}
                                bold={true}
                            />

                            <InfoBox
                                left={`${city1.pctTotal}%`}
                                text={countryText}
                                region={city1.name}
                                small={false}
                                bold={false}
                                align={'flex-start'}
                            />
                            {city2 && (
                                <>

                                    <InfoBoxTitle
                                        left={city2.name}
                                        text={numberWithCommas(city2.distance) + distanceText}
                                        region={''}
                                        align={'space-between'}
                                        small={true}
                                        bold={true}
                                    />
                                    <InfoBox
                                        left={`${city2.pctTotal}%`}
                                        text={countryText}
                                        region={city2.name}
                                        small={false}
                                        bold={false}
                                        align={'flex-start'}
                                    />
                                </>
                            )
                            }
                        </div>
                    )}
                </div>
            )}
        </div >
    )
}

function InfoBox({ left, text, region, small, bold, align }) {
    return (
        <div
            className={styles.infoBox}
            style={{

                ['--alignment' as any]: align || 'flex-start',
            }}>
            {left &&
                (<h4
                    style={{ ['--weight' as any]: bold ? '600' : 'initial' }}
                >{left}</h4>)}
            <p
                style={{ ['--size' as any]: small ? '0.65rem' : '0.75rem' }}
            >{text} <span style={{ fontWeight: '620' }}>{region}</span> </p>
        </div>
    )
}

function InfoBoxTitle({ left, text, region, small, bold, align }) {
    return (
        <div
            className={styles.infoBox}
            style={{

                ['--alignment' as any]: align || 'flex-start',
            }}>
            {left &&
                (<h4
                    style={{ ['--weight' as any]: bold ? '600' : 'initial' }}
                >{left}</h4>)}
            <p
                style={{ ['--size' as any]: small ? '0.65rem' : '0.75rem' }}
            >{text} <span style={{ fontWeight: '620' }}>{region}</span> </p>
        </div>
    )
}