/**
 * Simple controlled slider component.
 */
import styles from '../../../styles/Slider.module.css';

const RiskWeightSlider = ({ riskId, riskWeight, onUpdate }) => {
  return (
    <div className={styles.SliderContainer}>
      <p className="label-weight">Risk importance:</p>
      <span className={styles.mainSlider}>
        <p>Less</p>
        <span className={styles.progress} />
        <input
          type="range"
          value={riskWeight}
          min={0}
          max={100}
          step={1}
          onChange={(e) => onUpdate(parseInt(e.target.value))}
        />
        <p>More</p>
      </span>
    </div>
  );
};

export default RiskWeightSlider;
