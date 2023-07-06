import { useState, useRef, useContext, useEffect, Fragment } from "react";
import { useSpring, motion, AnimatePresence, useTransform, useMotionValue } from "framer-motion";
import styles from "./../../styles/JourneyNav.module.css"
import { SectionContext } from '../../pages';
import useSWR from 'swr';
import { v4 as uuidv4 } from 'uuid'
import Link from "next/link";
import useWindowSize from "../../hooks/useWindowSize";

const fetcher = (url) => fetch(url).then((res) => res.json());


export default function VignetteChapterNav({ journeys }) {
    const { data: narrativeItems, error: narrativeError } = useSWR('/api/map/narrativedata', fetcher)
    const ref = useRef(null);
    const { width } = useWindowSize()
    const boxRef = useRef(null);
    const svgRef = useRef(null);
    const zip = (a, b) => Array.from(Array(Math.max(b.length, a.length)), (_, i) => [a[i], b[i]]);

    const y = useMotionValue(0)
    const positionY = useTransform(
        y,
        [0, 100],
        [0, 100]
    )


    const { currentSection, setSection } = useContext(SectionContext)
    const sectionIndex = currentSection && currentSection.index

    if (narrativeError) return <div>Images not found</div>;
    if (!narrativeItems) return <div>loading...</div>;
    if (!journeys) return <></>

    const vignettes = zip(narrativeItems.vignetteUrls, journeys.slice(1)).map((journeyPackage, index) => {
        const [url, journey] = journeyPackage
        const goToRouteLink = () => window.location.href = '/journeys/' + journey.route
        let vignetteHovered = false

        const routeHovered = index == parseInt(sectionIndex) - 1
        function highlightSegment() {
            vignetteHovered = true
            setSection({ routeId: index + 1, vignetteHovered: index })
        }
        return (
            <Fragment
                key={`${index}${uuidv4}`}>
                <motion.div
                    data-title={journey.title}
                    data-url={'/journeys/' + journey.route}
                    ref={boxRef}
                    className={styles.vignettes}
                    animate={{
                        y: routeHovered ? 0 : 80,
                    }}
                    onMouseEnter={() => vignetteHovered = true}
                    onMouseLeave={() => vignetteHovered = false}
                    onMouseMove={highlightSegment}
                    onClick={goToRouteLink}
                    transition={{ type: "spring", duration: 0.75 }}
                    whileHover={{
                        transition: {
                            type: 'spring',
                            stiffness: 37.5,
                            duration: 0.8,
                        },
                        y: 0,
                        zIndex: 6,
                    }}
                    style={{
                        y: 80,
                        transition: {
                            type: 'spring',
                            stiffness: 37.5,
                            duration: 0.8,
                        },
                    }}
                >
                    <img
                        src={url}
                    >
                    </img>
                    {<Link
                        href={'/journeys/' + journey.route}
                        className={styles.journeyLink}
                    >

                        {(width > 1000 || routeHovered || (currentSection?.vignetteHovered) === index) && journey.title}

                    </Link>}
                </motion.div>
                {index < 6 && (
                    <div key={"gate" + uuidv4()} className={styles.gates}></div>
                )}

            </Fragment>
        )
    })

    const singleVignette = vignettes.filter((vignette, index) => index == parseInt(sectionIndex) - 1)
    return (
        <>
            <div key={uuidv4} className={styles.journeyContainer} ref={ref}>
                <div className={styles.hoverBlocker} />
                {width > 700 ? vignettes : singleVignette}
            </div>

        </>
    )

}
