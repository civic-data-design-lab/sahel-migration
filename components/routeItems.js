import styles from '../styles/RouteItems.module.css'
const originCountries = ["Niger", 'Chad', 'Nigeria', 'Mali', 'Ghana', "Cote d'Ivoire"]

export default function RouteItems({ isOpen }) {
    return (
        <>
            <ul className={styles.routeContainer}>
                {originCountries.map((name) => {
                    return (
                        <li className={styles.route} key={name}>
                            {name}
                            <span className="material-symbols-outlined">arrow_forward</span>
                            <span>Libya</span>
                        </li>
                    )
                })}
            </ul>
        </>)
}