import styles from "../../styles/MapLegend.module.css"
import { motion, useTransform } from "framer-motion";
import { useSpring } from "react-spring";
import { useContext, useState } from "react";
import { SectionContext } from "../../pages";
import { v4 as uuidv4 } from 'uuid'

function StatMorph({ open }) {
    const r = 50
    const cx = 50
    const cy = 50

    const outputRange = [
        `
        M ${cx} ${cy} m ${r}, 0 a ${r},${r} 0 1,0 -${r * 2},0 a ${r},${r} 0 1,0  ${r * 2},0
        `,
        `
        M 0 0 l 0 100 l 200 0 l 0 -200 z
        `
    ];

    const clip_path_variants = {
        open: {
            d: outputRange[0]
        },
        closed: {
            d: outputRange[1]
        }
    }

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1450 960"
        >
            <motion.path
                d={`
              M ${cx} ${cy} m ${r}, 0 a ${r},${r} 0 1,0 -${r * 2},0 a ${r},${r} 0 1,0  ${r * 2},0
              `}
                variants={clip_path_variants}
                animate={open ? "closed" : "open"}
                transition={{
                    ease: "easeInOut",
                    duration: 0.5
                }}
            />
        </svg>
    );

}

export default function MapLegend({ activeSource }) {
    const { currentSection, setSection } = useContext(SectionContext)
    const colors = ['#F9BDA7', '#F79C7C', '#F47B50', '#F15A24', '#B5441B', '#792D12', '#463C35']

    const r = 25
    const cx = 50
    const cy = 50

    const [clicked, setClick] = useState(false)


    const displayLegend = useSpring({
        opacity: currentSection == 7 ? 0 : 1,
    });

    function toggleClick() {
        setClick(!clicked)
    }



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
                    className={styles.indicators}
                    style={{
                        display: 'flex',
                        justifyContent: "space-between"
                    }}>
                    <span><h4>0</h4></span>
                    <span><h4>360</h4></span>
                </div>
                <h4>Migration Routes to Libya</h4>
            </div>

        </div>
    )
}