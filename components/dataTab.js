import {animated, useSpring} from "react-spring";
import React, {useState} from "react";
import DataTabToggle from "./dataTabToggle";
import styles from "../styles/DataTab.module.css";
import Link from "next/link";
import RiskItems from "./riskItems";
import useWindowSize from "../hooks/useWindowSize";

export default function DataTab() {
  const [isOpen, toggleOpen] = useState(false);
  const {width, height} = useWindowSize()
  const handleToggle = () => {
    toggleOpen(!isOpen);
  };

  const fullscreenTab = useSpring({
    opacity: isOpen ? 1 : .9,
    y: isOpen ? width < 480 ?-height*(.9-.1): -height*(.9-.25):0,
    config: { tension: 170, friction: 26, precision: 0.01, clamp: false },
    position: 'fixed',
    left: 0,
    height: isOpen? height*.9: height*.25,
    width: width
  });

  return (
    <>
        <animated.div style={fullscreenTab} className={styles.tab}>
          <DataTabToggle isOpen={isOpen} toggleOpen={handleToggle}/>
          <RiskItems isOpen={isOpen}/>
        </animated.div>
    </>);
}
