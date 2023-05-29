import styles from "../../styles/MapLegend.module.css"
import { motion, useTransform } from "framer-motion";
import { useSpring } from "react-spring";
import { useContext, useEffect, useRef, useState } from "react";
import { SectionContext } from "../../pages";
import { v4 as uuidv4 } from 'uuid'
import useWindowSize from "../../hooks/useWindowSize";

export default function MapLegend({ activeSource }) {
    const { currentSection, setSection } = useContext(SectionContext)
    const colors = ['#FCDED3', '#F9BDA7', '#F79C7C', '#F47B50', '#F15A24', '#B5441B', '#792D12', '#463C35']
    const cityLegendLabel = 'Counts of Migrants Surveyed by Place of Origin'
    const transectLegendLabel = 'Risk Level Along Route'
    const titleRef = useRef(null)
    const containerRef = useRef(null)
    const { width } = useWindowSize()


    const [clicked, setClick] = useState(false)




    const displayLegend = useSpring({
        opacity: currentSection == 7 ? 0 : 1,
    });

    function toggleClick() {
        setClick(!clicked)
    }

    const transectLegend = <div>
        <div className={styles.label}>
            <h4 >{transectLegendLabel}</h4>
        </div>
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
            <span><h4>0</h4></span>
            <span><h4>360</h4></span>
        </div>
    </div>
    const cityLegend = (() => {
        const scaleRanges = ["1-24", "25-49", "50-74", "75-100"]
        return (
            <div>
                <div className={styles.label}>
                    <h4 >{cityLegendLabel}</h4>
                </div>
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
                                    <h4>{range}</h4></div>
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
            className={styles.legend}
            style={displayLegend}
            ref={containerRef}
        >
            <div className={styles.routes}>
                {activeSource === "originCities" && (cityLegend())}
                {activeSource === "transectSegment" && (transectLegend)}
                <h4
                    className={styles.subheader}
                    ref={titleRef}
                >Migration Routes to Libya</h4>

            </div>

        </div>
    )
}