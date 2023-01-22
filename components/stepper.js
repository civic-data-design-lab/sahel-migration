import styles from '../styles/Stepper.module.css';

export default function Stepper({ totalSteps, stepNumber }) {
  const steps = [...Array(totalSteps + 1).keys()];
  function renderSteps(currentStep, stepNumber) {
    const isFilled = currentStep < stepNumber ? styles.filled : '';
    return <div className={`${styles.step} ${isFilled}`}></div>;
  }
  return (
    <div className={styles.stepper}>
      {steps.map((currentStep) => renderSteps(currentStep, stepNumber))}
    </div>
  );
}
