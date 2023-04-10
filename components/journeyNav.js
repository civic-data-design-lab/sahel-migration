import { useState, useRef, useContext, useEffect, Fragment } from "react";
import { useSpring, motion, AnimatePresence } from "framer-motion";
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
                    ref={boxRef}
                    className={styles.vignettes}
                    animate={{
                        filter: routeHovered ? 'grayscale(0)' : 'grayscale(1)',
                        scaleY: routeHovered ? 1.1 : 1,
                        width: routeHovered ? ref.current && ref.current.offsetWidth / 7 * 1.1 : 'initial',
                    }}
                    transition={{ type: "tween", duration: 0.75 }}
                    whileHover={{
                        transition: {
                            type: 'tween',
                            stiffness: 37.5,
                            duration: 0.75,
                        },
                        width: ref.current && ref.current.offsetWidth / 7 * 1.1,
                        scaleY: 1.1,
                        filter: 'grayscale(0)',
                        zIndex: 6,
                        border: "2px solid white"
                    }}
                    style={{
                        filter: 'grayscale(1)',
                        border: routeHovered ? "2px solid white" : 'initial',
                        transition: {
                            type: 'spring',
                            stiffness: 37.5,
                            duration: 0.75,
                        },
                    }}
                >
                    <img
                        src={url}
                    >
                    </img>
                    <Link
                        // key={`${journey.id}${uuidv4}`}
                        href={'/journeys/' + journey.id}
                        className={styles.journeyLink}
                    >{journey.title}

                    </Link>
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