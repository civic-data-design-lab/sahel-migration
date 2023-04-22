import { useState, useRef, useContext, useEffect, Fragment } from "react";
import { useSpring, motion, AnimatePresence, useTransform, useMotionValue } from "framer-motion";
import styles from "./../styles/JourneyNav.module.css"
import { SectionContext } from '../pages';
import useSWR from 'swr';
import { v4 as uuidv4 } from 'uuid'
import Link from "next/link";

const fetcher = (url) => fetch(url).then((res) => res.json());


export default function JourneyNav({ journeys }) {
    const { data: riskItems, error: risksError } = useSWR('/api/map/risksdata', fetcher)
    const ref = useRef(null);
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

    if (risksError) return <div>Images not found</div>;
    if (!riskItems) return <div>loading...</div>;
    if (!journeys) return <></>


    const vignettes = zip(riskItems.vignetteUrls, journeys.slice(1)).map((journeyPackage, index) => {
        const [url, journey] = journeyPackage

        const routeHovered = index == parseInt(sectionIndex)
        return (
            <Fragment
                key={`${index}${uuidv4}`}>
                <motion.div
                    data-title={journey.title}
                    data-url={'/journeys/' + journey.id}
                    ref={boxRef}
                    className={styles.vignettes}
                    animate={{
                        y: routeHovered ? 0 : 80,
                    }}
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
                        href={'/journeys/' + journey.id}
                        className={styles.journeyLink}
                    >{journey.title}

                    </Link>}
                </motion.div>


            </Fragment>
        )
    })
    return (
        <>
            <div key={uuidv4} className={styles.journeyContainer} ref={ref}>
                {vignettes}
            </div>

        </>
    )

}