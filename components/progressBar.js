import styles from '../styles/ProgressBar.module.css'
import { motion } from 'framer-motion';

export default function ProgressBar({ narratives, currenNarrativeSection }) {
    const steps = [0, 1, 2, 3]
    const stepNumber = narratives.find(narrative => narrative.id === currenNarrativeSection).index
    function renderSteps(currentStep, stepNumber, narrativeId) {
        const isFilled = currentStep <= stepNumber ? styles.filled : '';
        const isCurrent = currentStep > stepNumber ? styles.current : '';
        function scrollToText() {
            const el = document.getElementById(narrativeId)
            el.scrollIntoView()
        }
        return (
            <div
                key={currentStep}
                className={styles.stepContainer}
            >
                <motion.div
                    className={`${styles.step} ${isFilled} ${isCurrent}`}
                    onClick={scrollToText}
                    whileHover={{
                        backgroundColor: "#463c35"
                    }}

                />
            </div>
        );
    }

    return (
        <div
            className={styles.stepper}
        >
            <div className={styles.stepperLine}></div>
            {steps.map((currentStep, index) => renderSteps(currentStep, stepNumber, narratives[index].id))}
        </div>
    )
}