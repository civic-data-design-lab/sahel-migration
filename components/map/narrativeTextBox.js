import { useRef, useEffect, useContext, useState, useMemo } from 'react';
import { useInView, useScroll, motion, useMotionValueEvent } from 'framer-motion';
import styles from '../../styles/ContentBox.module.css';
import { ViewContext } from '../../pages/maps/map';
import { v4 as uuidv4 } from 'uuid';
import useWindowSize from '../../hooks/useWindowSize';
import ScrollIndicator from '../scrollIndicator';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ProgressBar from '../progressBar';

function Paragraph({ children, data, nextElem, narrativeItems, journeys }) {
    const { width } = useWindowSize()
    const ref = useRef(null);
    const threshold = width <= 600 ? 0.5 : 0.7;
    const link = data.id !== "globeView" ? () => { } : () => { window.location.href = '/journeys/beginning-journey' }
    const isInView = useInView(ref, {
        amount: threshold,
    });
    const router = useRouter();

    const { currentView, setCurrentView } = useContext(ViewContext);
    const handleRouting = (href) => {
        return async (e) => {
            e.preventDefault();
            await router.push(href);
        };
    };
    const beginJourney = journeys[1];

    function scrollToNext() {
        const el = document.getElementById(nextElem)
        el.scrollIntoView()
    }

    useEffect(() => {
        if (isInView) {
            setCurrentView(data.id);
        }
    }, [isInView]);
    return (
        <motion.div
            className={styles.paragraph}
            ref={ref}
        >
            <h2 className="header-3"
                style={{
                    cursor: data.id === "globeView" ? "pointer" : 'auto'
                }}
                onClick={link}
            >{data.heading}</h2>
            <p
                className="body-3"
                style={{
                    fontWeight: 'initial',
                }}
            >
                {data.body}
            </p>

            <ProgressBar
                narratives={narrativeItems}
                currenNarrativeSection={currentView}

            />

        </motion.div>
    );
}

export default function NarrativeTextBox({ dataItems, journeys }) {
    const contentRef = useRef(null);
    const { width } = useWindowSize()

    const paragraphs = dataItems.map((data, index) => {
        const nextIndex = (index + 1) % dataItems.length
        return (
            <div
                className={`${styles.paragraphContainer}`}
                key={uuidv4()}
                id={data.id}
                data-id={`${data.id}${width < 480 ? "_small"
                    : 480 <= width < 1000 ? "_medium" : ""}`}
            >
                <Paragraph
                    data={data}
                    nextElem={dataItems[nextIndex].id}
                    narrativeItems={dataItems}
                    journeys={journeys}></Paragraph>
            </div>
        );
    })

    return (
        <>
            <div ref={contentRef}
                className={styles.container}
                id='narrative-text'
            >
                <div className={styles.content}>

                    {paragraphs}
                </div>
            </div>
        </>
    );
}