import { useRef, useEffect, useContext, useState, useMemo } from 'react';
import { useInView, useScroll } from 'framer-motion';
import styles from '../../styles/ContentBox.module.css';
import { ViewContext } from '../../pages/maps/map';
import { v4 as uuidv4 } from 'uuid';
import RouteMenu from './routeMenu';
import RouteMenuToggle from './routeMenuToggle';
import { animated, useSpring } from 'react-spring';
import useWindowSize from '../../hooks/useWindowSize';
import ScrollIndicator from '../scrollIndicator';

function Paragraph({ children, data, nextElem }) {
    const { width } = useWindowSize()
    const ref = useRef(null);
    const threshold = width <= 600 ? 0.5 : 1;
    const link = data.id !== "globeView" ? () => { } : () => { window.location.href = '/journeys/beginning-journey' }
    const isInView = useInView(ref, {
        amount: threshold,
    });
    const { currentView, setCurrentView } = useContext(ViewContext);
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
        <div className={styles.paragraph} ref={ref}>
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
            {data.id !== "globeView" && (
                <ScrollIndicator
                    onClick={scrollToNext}
                />
            )
            }
        </div>
    );
}

function ScrollButton({ onClick, currentView }) {
    const exploreAvailable = currentView === 'selectRoute' ? true : false;
    return (
        <>
            <button className={styles.scrollButton} onClick={onClick}>
                <animated.div>
                    {exploreAvailable ? (
                        <span className="material-symbols-outlined"> keyboard_double_arrow_up</span>
                    ) : (
                        <span className="material-symbols-outlined">keyboard_double_arrow_down</span>
                    )}
                </animated.div>
            </button>
        </>
    );
}

export default function ContentBox({ dataItems, toggleMap }) {
    const contentRef = useRef(null);
    const [isOpen, toggleOpen] = useState(false);
    const [scroll, setScroll] = useState();
    const [scrollEnd, toggleScrollStatus] = useState(false)
    const [isClicked, toggleClick] = useState(false);
    const { scrollYProgress, scrollY } = useScroll({
        container: contentRef
    })
    const [scrollStrength, setScrollStrength] = useState(0)
    const { currentView, setCurrentView } = useContext(ViewContext);


    const handleMapAnimation = () => {
        toggleOpen(!isOpen);
    };

    const handleToggle = () => {
        toggleOpen(!isOpen);
    };


    useEffect(() => {

        const contentBox = contentRef.current;
        if (currentView === 'selectRoute') toggleClick(false);
        if (currentView === 'selectRoute' && isClicked) {
            setTimeout(
                contentBox.scrollTo({
                    top: scroll,
                    behavior: 'smooth',
                }),
                100
            );
        }

    }, [scrollYProgress]);

    const globeTransition = () => {
        if (scrollYProgress.current >= 1) {
            toggleScrollStatus(true)
            setTimeout(() => {
                toggleMap()
            }, 500)
        }
        else toggleScrollStatus(false)
    }

    const scrollUp = () => {
        setScroll(1200);
        toggleClick(!isClicked);
    };
    return (
        <>
            <div ref={contentRef} className={styles.container} onTouchMove={globeTransition}>
                {dataItems.map((data, index) => {
                    const nextIndex = (index + 1) % dataItems.length
                    return (
                        <div
                            className={styles.paragraphContainer}
                            key={uuidv4()}
                            id={data.id}
                        >
                            <Paragraph data={data} nextElem={dataItems[nextIndex].id}></Paragraph>
                        </div>
                    );
                })}
            </div>
            <RouteMenu isOpen={isOpen} mapToggle={handleMapAnimation} />

            <RouteMenuToggle isOpen={isOpen} toggleOpen={handleToggle} currentView={currentView} />
        </>
    );
}


