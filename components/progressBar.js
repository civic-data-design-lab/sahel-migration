import styles from '../styles/ProgressBar.module.css'
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import useWindowSize from '../hooks/useWindowSize';

export default function ProgressBar({ narratives, currenNarrativeSection }) {
    const steps = [0, 1, 2, 3]
    const { width } = useWindowSize()
    const [stepNumber, setStep] = useState(narratives.find(narrative => narrative.id === currenNarrativeSection).index)
    const tooltip = (
        <Tooltip id="tooltip">
            <strong>Click on dots to advance to next narrative!</strong>
        </Tooltip>
    );
    function advanceStep() {
        if (stepNumber < 3) {
            const el = document.getElementById(narratives[stepNumber + 1].id)
            el.scrollIntoView()
            setStep(stepNumber + 1)
        }
        else window.location.href = '/journeys/beginning-journey'
    }

    useEffect(() => {
        setStep(narratives.find(narrative => narrative.id == currenNarrativeSection).index)
    }, [currenNarrativeSection])

    function renderSteps(currentStep, stepNumber, narrativeId) {
        const isFilled = currentStep === stepNumber ? styles.filled : '';
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
                        backgroundColor: "#463c35",
                        color: "rgb(255,255,255)"
                    }}

                >

                    {currentStep + 1}
                </motion.div>

            </div>
        );
    }


    return (

        <OverlayTrigger
            placement={"right"}
            overlay={tooltip}>
            <div
                className={styles.stepper}
            >
                {/* <div className={styles.stepperLine}></div> */}

                {steps.map((currentStep, index) => renderSteps(currentStep, stepNumber, narratives[index].id))}
                <div
                    className={styles.stepContainer}
                    onClick={advanceStep}

                >
                    <motion.div
                        className={styles.next}
                        whileHover={{
                            backgroundColor: "#463c35",
                            color: "rgb(255,255,255)"
                        }}

                    >

                        <span>Next</span>
                        <span class="material-symbols-outlined">
                            navigate_next
                        </span>
                    </motion.div>

                </div>
            </div>
        </OverlayTrigger>
    )
}