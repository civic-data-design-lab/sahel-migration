import React, { useEffect, useState } from 'react';
import { Popup } from 'react-map-gl'
import { Stack } from 'react-bootstrap'
import styles from './../../styles/Tooltip.module.css'
import { v4 as uuidv4 } from 'uuid'
import { TEMPORARY_REDIRECT_STATUS } from 'next/dist/shared/lib/constants'
import { handleWebpackExternalForEdgeRuntime } from 'next/dist/build/webpack/plugins/middleware-plugin';


export default function Tooltip({ selectedCountry, hoverInfo, data, cityData }) {
    const surveyData = data && data.migrantData
    const countryData = surveyData.find((country) => country.countryId == selectedCountry)
    const nationalMigrantCount = (countryData && countryData.migrantCount) || 0
    const totalSurveyed = 347
    const distanceText = ` km to Tripoli`
    const uniqueCountries = ['Libya', 'Niger']
    const nationalityLabel = {
      "Benin" : "Beninois",
      "Burkina Faso" : "Burkinab&Eacute;",
      "Chad" : "Chadian",
      "C\u00f4te d'Ivoire" : "Ivorian",
      "Ghana" : "Ghanaian",
      "Guinea" : "Guinean",
      "Guninea-Bissau" : "Bissau-Guinean",
      "Liberia" : "Liberian",
      "Libya": "Libyan",
      "Mali": "Malian",
      "Niger" : "Nigerien",
      "Nigeria" : "Nigerian",
      "Senegal" : "Senegalese",
      "Sierra Leone" : "Sierra Leonean"
    }
    const countryText = `of ${nationalityLabel[selectedCountry]} migrants surveyed in Libya come from`

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

    // TO-DO CREATE USE EFFECT TO RE-RENDER TOOLTIP MOUSE POSITION TO TEXT DOES NOT CUT OFF
    // const [mousePos, setMousePos] = useState({});
    // useEffect(() => {
    //   const handleMouseMove = (event) => setMousePos({
    //     x: event.clientX, 
    //     y: event.clientY
    //   });

    //   window.addEventListener("mousemove", handleMouseMove);
      
    //   return () => {
    //     window.removeEventListener("mousemove", handleMouseMove)
    //   }
    // }, []);
    // const winWidth = window.innerWidth;
    // const winHeight = window.innerHeight;

    // testing for tooltip mouse position - delete if not needed
    // let offsetX = 150;
    // let popupAnchor = "center";
    // window.addEventListener('mousemove', (event) => {
    //   mousePosX = event.clientX;
    //   console.log("winWidth: " + winWidth + ", mouseX: " + mousePosX);
    //   console.log(winWidth < mousePosX + 400)
    //   mousePosY = event.clientY;
    //   offsetX = (winWidth < mousePosX + 400) ? -650 : 150;
    //   popupAnchor = (winWidth < mousePosX + 400) ? "right" : "center"
      // console.log({ x: posX, y: posY });
      // return { x: posX, y: posY };
    // });
    // const tooltipWidth = document.getElementById("map-tooltip").offsetWidth;
    // const tooltipHeight = document.getElementById("map-tooltip").offsetHeight;
    // const tooltipPosX = document.getElementById("map-tooltip").getBoundingClientRect().x;
    // const tooltipPosY = document.getElementById("map-tooltip").getBoundingClientRect().y;
    // const offsetX = (winWidth > tooltipPosX + tooltipWidth) ? -tooltipWidth - 150 : 150;
    // const offsetY = (winHeight > tooltipPosX + tooltipHeight) ? -tooltipHeight - 150 : 150;

    return (
      <Popup style={{
          // maxWidth: '400px',
          display: 'flex',
          flexDirection: 'column-reverse',
        }}
          longitude={hoverInfo.longitude}
          latitude={hoverInfo.latitude}
          offset={[150, -150]}
          anchor="center"
          closeButton={false}
          className="country-info"
      >
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
                <hr/>
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
                    left={`${Math.floor(nationalMigrantCount * 100 / totalSurveyed)}%`}
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
                      <hr/>
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
                          left={`${Math.floor(city1.count / nationalMigrantCount * 100)}%`}
                          text={countryText}
                          region={city1.name}
                          small={false}
                          bold={false}
                          align={'flex-start'}
                      />
                      <InfoBoxTitle
                          left={city2.name}
                          text={numberWithCommas(city2.distance) + distanceText}
                          region={''}
                          align={'space-between'}
                          small={true}
                          bold={true}
                      />
                      <InfoBox
                          left={`${Math.floor(city2.count / nationalMigrantCount * 100)}%`}
                          text={countryText}
                          region={city2.name}
                          small={false}
                          bold={false}
                          align={'flex-start'}
                      />
                  </div>
                )}
              </div>
            )}
          </div >
      </Popup>
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