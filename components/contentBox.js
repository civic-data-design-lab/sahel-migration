import { useRef, useEffect, useContext, useState } from 'react'
import { useInView } from 'framer-motion'
import styles from './../styles/ContentBox.module.css'
import { ViewContext } from '../pages/maps/map'
import { v4 as uuidv4 } from 'uuid'
import RouteMenu from './routeMenu'
import RouteMenuToggle from './routeMenuToggle'


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

        if (data === items[items.length - 1]) {
            console.log('End of list')
        }
    }, [isInView])
    return (
        <div
            className={styles.paragraph}
            ref={ref}
        >
            {children}
            <h2>{data.heading}</h2>
            <p>{data.body}</p>
        </div>
    )
}

export default function ContentBox({ dataItems }) {
    const contentRef = useRef(null)
    const [isOpen, toggleOpen] = useState(false);
    const { currentView, setCurrentView } = useContext(ViewContext)

    const handleToggle = () => {
        toggleOpen(!isOpen);
    };
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

                <RouteMenu isOpen={isOpen} />

            </div >
            <RouteMenuToggle isOpen={isOpen} toggleOpen={handleToggle} currentView={currentView} />

        </>
    )
}