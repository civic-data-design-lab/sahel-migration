/**
 * Simple controlled slider component.
 */
import styles from '../../../styles/Slider.module.css';

const RiskWeightSlider = ({ riskId, riskWeight, onUpdate }) => {
  return (
    <div className={styles.SliderContainer}>
      <p class="body-4">Risk weight factor</p>
      <span className={styles.progress} />
      <input
        type="range"
        value={riskWeight}
        min={0}
        max={100}
        step={1}
        onChange={(e) => onUpdate(parseInt(e.target.value))}
      />
    </div>
  );
};

export default RiskWeightSlider;
