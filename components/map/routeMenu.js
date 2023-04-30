import { animated, useSpring } from "react-spring";
import React, { useState } from "react";
import DataTabToggle from "./../dataTabToggle";
import styles from "./../../styles/RouteMenu.module.css";
import Link from "next/link";
import useWindowSize from "./../../hooks/useWindowSize";
import RouteItems from "./routeItems";

export default function RouteMenu({ isOpen, mapToggle }) {
    const { width, height } = useWindowSize()


    const fullScreenFill = useSpring({
        opacity: isOpen ? 1 : 0,
    })
    const fullscreenTab = useSpring({
        opacity: isOpen ? 1 : .9,
        y: isOpen ? width < 480 ? -height * (.9 - .12) : -height * (.9 - .25) : 0,
        config: { tension: 170, friction: 26, precision: 0.01, clamp: false },
        position: 'fixed',
        left: 0,
        height: isOpen ? height * .9 : height * .25,
        width: width
    });

    return (
        <>
            <animated.div style={fullScreenFill} className={styles.screenCover} />
            <animated.div style={fullscreenTab} className={styles.tab}>
                <RouteItems mapToggle={mapToggle} />
            </animated.div>
        </>);
}