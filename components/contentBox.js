import { useRef, useEffect, useContext, useState } from 'react'
import { useInView } from 'framer-motion'
import styles from './../styles/ContentBox.module.css'
import { ViewContext } from '../pages/maps/map'
import { v4 as uuidv4 } from 'uuid'
import RouteMenu from './routeMenu'
import RouteMenuToggle from './routeMenuToggle'
import { animated, useSpring } from "react-spring";
import useWindowSize from '../hooks/useWindowSize'


function Paragraph({ children, data, items }) {
    const ref = useRef(null)
    const threshold = data === items[items.length - 2] ?
        0.75 :
        1
    const isInView = useInView(ref, {
        amount: threshold
    })
    const { currentView, setCurrentView } = useContext(ViewContext)
    useEffect(() => {
        if (isInView) {
            setCurrentView(data.id)
        }

    }, [isInView])
    return (
        <div
            className={styles.paragraph}
            ref={ref}
        >
            <h2 className='header-3'>{data.heading}</h2>
            <p
                className='header-3'
                style={{
                    fontWeight: 'initial'
                }}
            >{data.body}</p>
        </div>
    )
}

function ScrollButton({ onClick, currentView }) {
    const exploreAvailable = currentView === 'selectRoute' ? true : false
    const { width } = useWindowSize()
    return (
        <>
            <button className={styles.scrollButton} onClick={onClick}>
                <animated.div>
                    {
                        exploreAvailable ?
                            <span class="material-symbols-outlined" > keyboard_double_arrow_up</span> :
                            <span class="material-symbols-outlined">keyboard_double_arrow_down</span>
                    }
                </animated.div>
            </button>
        </>
    )
}

export default function ContentBox({ dataItems, mapToggle }) {
    const contentRef = useRef(null)
    const [isOpen, toggleOpen] = useState(false);
    const [scroll, setScroll] = useState()
    const [isClicked, toggleClick] = useState(false)
    const { currentView, setCurrentView } = useContext(ViewContext)

    const handleMapAnimation = () => {
        toggleOpen(!isOpen);
        mapToggle()
    }

    const handleToggle = () => {
        toggleOpen(!isOpen);
    };

    useEffect(() => {
        const contentBox = contentRef.current
        if (currentView === 'selectRoute') toggleClick(false)
        if (currentView === 'selectRoute' && isClicked) {
            setTimeout(contentBox.scrollTo({
                top: scroll,
                behavior: 'smooth'
            }), 100

            )

        }
    })

    const scrollUp = () => {
        setScroll(1200)
        toggleClick(!isClicked)
    }
    return (
        <>
            <div ref={contentRef} className={styles.container}>
                {
                    dataItems.map(data => {
                        return (
                            <div
                                className={styles.paragraphContainer}
                                key={uuidv4()}
                                style={{
                                    display: data.id === 'selectRoute' ?
                                        'block' :
                                        'flex'
                                }

                                }>
                                <Paragraph
                                    data={data}
                                    items={dataItems}>
                                </Paragraph>
                            </div>
                        )
                    })
                }



            </div >
            <RouteMenu isOpen={isOpen} mapToggle={handleMapAnimation} />


            <RouteMenuToggle isOpen={isOpen} toggleOpen={handleToggle} currentView={currentView} />

        </>
    )
}