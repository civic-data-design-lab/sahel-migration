import styles from "../../styles/MapLegend.module.css"
import { useSpring } from "react-spring";
import { useContext } from "react";
import { SectionContext } from "../../pages";

export default function MapLegend({ activeSource }) {
    const { currentSection, setSection } = useContext(SectionContext)


    const displayLegend = useSpring({
        opacity: currentSection == 7 ? 0 : 1,
    });

    return (
        <div
            className={styles.legend}
            style={displayLegend}
        >
            <div className={styles.routes}>
                <h4>Migration Routes to Libya</h4>
            </div>

        </div>
    )
}