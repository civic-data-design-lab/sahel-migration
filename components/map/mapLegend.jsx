import styles from "../../styles/MapLegend.module.css"
import { useSpring } from "react-spring";
import { useContext } from "react";
import { SectionContext } from "../../pages";
import { v4 as uuidv4 } from 'uuid'

export default function MapLegend({ activeSource }) {
    const { currentSection, setSection } = useContext(SectionContext)
    const colors = ['#F9BDA7', '#F79C7C', '#F47B50', '#F15A24', '#B5441B', '#792D12', '#463C35']


    const displayLegend = useSpring({
        opacity: currentSection == 7 ? 0 : 1,
    });

    return (
        <div
            className={styles.legend}
            style={displayLegend}
        >
            <div className={styles.routes}>
                <h4>Risk Level Along Route</h4>
                <div className={styles.bars}>
                    {colors.map((color, index) => {
                        return (
                            <div
                                key={"bar" + uuidv4()}
                                style={{
                                    display: "block",
                                    backgroundColor: color,
                                    height: `${(index + 1) / 7 * 100}%`
                                }}
                            >

                            </div>
                        )

                    })

                    }
                </div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: "space-between"
                    }}>
                    <span>0</span>
                    <span>360</span>
                </div>
                <h4>Migration Routes to Libya</h4>
            </div>

        </div>
    )
}