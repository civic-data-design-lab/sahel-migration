import styles from '../styles/Button.module.css'


export default function Button({ text, filled, onClick }) {
    const isFilled = filled ? styles.filled : ''
    return (
        <button
            className={`${styles.button} ${isFilled}`}
            onClick={onClick}
        >{text}
        </button>
    )
}