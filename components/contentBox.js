import { createContext, useRef, useEffect, useContext, useState } from 'react'
import { motion, useScroll, useInView } from 'framer-motion'
import styles from './../styles/ContentBox.module.css'
import { ViewContext } from '../pages/maps/map'


function Paragraph({ children, scrollRef, data }) {
    const ref = useRef(null)
    const isInView = useInView(ref, {
        amount: 1
    })
    const { currentView, setCurrentView } = useContext(ViewContext)
    useEffect(() => {
        console.log("Element is in view: ", isInView)
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

function Box({ isVisible }) {
    return (
        <div className={styles.box}>
            <h3></h3>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Beatae doloribus, quibusdam consequatur libero odit aspernatur nihil. Quasi repellat enim accusamus iure nemo aliquid! Libero beatae nam expedita. Asperiores esse error temporibus amet maiores possimus explicabo ut sint iusto accusantium quo at eum maxime beatae aliquam aspernatur, laborum, eveniet quam alias!</p>
        </div>
    );
}

export default function ContentBox({ body, scrollRef, dataItems }) {
    const contentRef = useRef(null)
    return (
        <div ref={contentRef} className={styles.container}>
            {
                dataItems.map(data => {
                    return (
                        <div className={styles.paragraphContainer}  >
                            <Paragraph
                                scrollRef={contentRef}
                                data={data}>
                            </Paragraph>
                        </div>
                    )
                })
            }
        </div >
    )
}