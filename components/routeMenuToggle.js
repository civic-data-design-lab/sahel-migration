import styles from '../styles/RouteMenuToggle.module.css'
import { animated, useSpring } from "react-spring";

export default function RouteMenuToggle({ isOpen, toggleOpen, currentView }) {
    const isActive = currentView === 'selectRoute' ? true : false

    const exploreRoutes = useSpring({
        bottom: isActive ? "0" : "-50px",
        position: 'relative',
        opacity: isActive ? 1 : 0,
        pointerEvents: isActive ? 'auto' : 'none'
    });

    return (<>
        {

            <div className={styles.buttonContainer} >
                <animated.div style={exploreRoutes}>
                    <button className={styles.toggleButton} onClick={toggleOpen}>
                        <h2>Select a <span style={{ color: 'var(--orange)' }}>Route</span> to Explore</h2>
                        {isOpen ?
                            <span className="material-symbols-outlined">expand_more</span> :
                            <span className="material-symbols-outlined">expand_less</span>
                        }
                    </button>
                </animated.div>
            </div>
        }
    </>)
}
