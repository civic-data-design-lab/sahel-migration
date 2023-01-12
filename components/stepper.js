import styles from '../styles/Stepper.module.css'

const steps = [1, 2, 3, 4, 5, 6, 7, 8]

export default function Stepper({ stepNumber }) {
    function renderSteps(currentStep, stepNumber) {
        const isFilled = currentStep < stepNumber ? styles.filled : ''
        return <div className={`${styles.step} ${isFilled}`}></div>
    }
    return (
        <div className={styles.stepper}>
            {steps.map((currentStep) => renderSteps(currentStep, stepNumber))}
        </div>

    )
}