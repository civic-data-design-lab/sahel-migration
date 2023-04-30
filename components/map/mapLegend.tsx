import styles from "../../styles/MapLegend.module.css"
export default function MapLegend({ activeSource }) {

    return (
        <div
            className={styles.legend}
        >

            <div className={styles.routes}>
                <h4>Migration Routes to Libya</h4>
            </div>

        </div>
    )
}