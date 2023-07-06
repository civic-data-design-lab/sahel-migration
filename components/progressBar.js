import styles from '../styles/ProgressBar.module.css'
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

export default function ProgressBar({ narratives, currenNarrativeSection }) {
    const steps = [0, 1, 2, 3]
    const [stepNumber, setStep] = useState(narratives.find(narrative => narrative.id === currenNarrativeSection).index)
    const tooltip = (
        <Tooltip id="tooltip">
            <strong>Click on dots to advance to next narrative!</strong>
        </Tooltip>
    );
    useEffect(() => {
        setStep(narratives.find(narrative => narrative.id == currenNarrativeSection).index)
    }, [currenNarrativeSection])
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
                    animate={{
                        backgroundColor: currentStep <= stepNumber ? "#463c35" : "white"
                    }}
                    whileHover={{
                        backgroundColor: "#463c35"
                    }}

                />
            </div>
        );
    }

    return (

        <OverlayTrigger placement="right" overlay={tooltip}>
            <div
                className={styles.stepper}
            >
                <div className={styles.stepperLine}></div>

                {steps.map((currentStep, index) => renderSteps(currentStep, stepNumber, narratives[index].id))}
            </div>
        </OverlayTrigger>
    )
}