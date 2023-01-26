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
    y: isOpen ? -height*.75:0,
    config: { tension: 170, friction: 26, precision: 0.01, clamp: true },
    position: 'fixed',
    left: 0,
    top: "75%",
    bottom: "25%",
    height: isOpen? height: height*.25,
    width: width
  });

  return (
    <div>
        <animated.div style={fullscreenTab} className={styles.tab}>
          <DataTabToggle isOpen={isOpen} toggleOpen={handleToggle}/>
          <RiskItems isOpen={isOpen}/>
        </animated.div>
    </div>);
}
