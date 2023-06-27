import styles from "../../styles/MapLegend.module.css";
import { motion, useTransform } from "framer-motion";
import { useSpring } from "react-spring";
import { useContext, useEffect, useRef, useState } from "react";
import { SectionContext } from "../../pages";
import { v4 as uuidv4 } from 'uuid'
import useWindowSize from "../../hooks/useWindowSize";
import InfoTooltipWrapper from "../infotooltip"

export default function MapLegend({ activeSource }) {
    const { currentSection, setSection } = useContext(SectionContext)
    const colors = ['#FCDED3', '#F9BDA7', '#F79C7C', '#F47B50', '#F15A24', '#B5441B', '#792D12', '#463C35']
    const cityLegendLabel = 'Migrants Surveyed by Place of Origin'
    const transectLegendLabel = 'Risk Level Along Route'
    const titleRef = useRef(null)
    const containerRef = useRef(null)
    const { width } = useWindowSize()

    const dataSourceText = (activeSource === "originCities") ? "Place of origin of irregular migrants surveyed in Libya in 2021 by the International Food Migrants from Economic Community of West African States (ECOWAS) countries were surveyed in Libya (Tripoli and Sabha) in June and July 2021 by the International Food Policy Research Institute. The origin location data of West African migrants is mapped by the counts of migrants per origin city. Research Institute."
        : (activeSource === "transectSegment" || activeSource === "globeView") ? "Migrants are always at risk while in transit. This migration risk score indicates relative variations of extreme risk with higher values that range from 0-100. The score is a composite of six risk factors: migrant reported violence incidents, conflict events, food insecurity, reliance on smugglers, remoteness, and heat exposure."
            : (activeSource === "overallRoutes") ? "Migration routes are mapped using origin and destination locations from the Flow Monitoring Survey Displacement Tracking Matrix data collected by the International Organization for Migration. The locations were mapped using ESRI’s geocoding service and the routes were computed using the Open Source Routing Tool."
                : null


    const displayLegend = useSpring({
        opacity: currentSection == 7 ? 0 : 1,
    });

    const transectLegend = <div>
        < InfoTooltipWrapper
            text={dataSourceText}
            placement="top"
        >

            <div className={styles.label}>
                <h4>
                  {transectLegendLabel}
                  <span
                    className="material-symbols-outlined"
                    id={styles.icon}
                  >
                    info
                  </span>
                </h4>
            </div>
        </InfoTooltipWrapper>
        <div className={styles.bars}>
            {colors.slice(1, 8).map((color, index) => {
                return (
                    <div
                        key={"bar" + uuidv4()}
                        style={{
                            display: "block",
                            backgroundColor: color,
                            height: `${(index + 1) / 7}rem`
                        }}
                    >
                    </div>
                )
            })}
        </div>
        <div
            className={styles.indicators}
            style={{
                display: 'flex',
                justifyContent: "space-between"
            }}>
            <span><p>0</p></span>
            <span><p>100</p></span>
        </div>
    </div>
    const cityLegend = (() => {
        const scaleRanges = ["1-24", "25-49", "50-74", "75-100"]
        return (
            <div>
                < InfoTooltipWrapper
                    text={dataSourceText}
                    placement="top"
                >
                    <div className={styles.label}>
                        <h4>
                          {cityLegendLabel}
                          <span
                            className="material-symbols-outlined"
                            id={styles.icon}
                          >
                            info
                          </span>
                        </h4>
                    </div>
                </InfoTooltipWrapper>
                <div className={styles.cityLegend}>
                    <>
                        {colors.slice(0, 4).map((color, index) => {
                            return (
                                <div
                                    key={"bar" + uuidv4()}
                                    style={{
                                        display: "flex",
                                        height: '100%',
                                        width: '100%',
                                        justifyContent: "center",
                                        alignItems: 'center'
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "block",
                                            borderRadius: '50%',
                                            backgroundColor: color,
                                            height: width > 600 ? `${(index + 1) / 2}rem` : `${(index + 1) / 4 * 100}%`,
                                            aspectRatio: '1/1'
                                        }}
                                    >
                                    </div>
                                </div>

                            )
                        })}
                        {scaleRanges.map(range => {
                            return (
                                <div
                                    key={uuidv4()}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <p>{range}</p></div>
                            )
                        })}
                    </>

                </div>
            </div>
        )
    })

    useEffect(() => {
        if (containerRef.current) {
            // containerRef.current.offsetWidth = titleRef.current.offsetWidth
        }
    }, [titleRef])

    return (

        <div
            style={displayLegend}
            ref={containerRef}
            className={styles.legend}
        >

            <div className={styles.routes}>
                {activeSource === "originCities" && (cityLegend())}
                {(activeSource === "transectSegment" || activeSource === "globeView") && (transectLegend)}
                {activeSource === "overallRoutes" && (
                    < InfoTooltipWrapper
                        text={dataSourceText}
                        placement="top"
                    >
                        <h4
                            className={styles.subheader}
                            ref={titleRef}
                        >
                          Migration Routes to Libya
                          <span
                            className="material-symbols-outlined"
                            id={styles.icon}
                          >
                            info
                          </span>
                        </h4>
                    </ InfoTooltipWrapper>
                )}


            </div>

        </div>
    )
}