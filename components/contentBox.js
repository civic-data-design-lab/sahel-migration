import { useRef, useEffect, useContext } from 'react'
import { useInView } from 'framer-motion'
import styles from './../styles/ContentBox.module.css'
import { ViewContext } from '../pages/maps/map'


function Paragraph({ children, data }) {
    const ref = useRef(null)
    const isInView = useInView(ref, {
        amount: 1
    })
    const { currentView, setCurrentView } = useContext(ViewContext)
    useEffect(() => {
        if (isInView) {
            setCurrentView(data.id)
        }
    }, [isInView])
    return (
        <div className={styles.paragraph} ref={ref}>
            {children}
            <h2>{data.heading}</h2>
            <p>{data.body}</p>
        </div>
    )
}

export default function ContentBox({ dataItems }) {
    const contentRef = useRef(null)
    return (
        <div ref={contentRef} className={styles.container}>
            {
                dataItems.map(data => {
                    return (
                        <div className={styles.paragraphContainer}  >
                            <Paragraph
                                data={data}>
                            </Paragraph>
                        </div>
                    )
                })
            }
        </div >
    )
}