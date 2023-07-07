import useWindowSize from '../../../hooks/useWindowSize';
import styles from '../../../styles/DataTabToggle.module.css';
import InfoTooltipWrapper from '../../infotooltip';

export default function DataTabToggle({ isOpen, toggleOpen }) {
  const textCombined = 'Click to view the migration risks combined together.';
  const textLayers = 'Click to explore each migration risk further.';
  const riskDescription =
    'Migrants are always at risk while in transit. This migration risk score indicates relative variations of extreme risk with higher values that range from 0-100. The score is a composite of six risk factors: migrant reported violence incidents, conflict events, food insecurity, reliance on smugglers, remoteness, and heat exposure. ';
  let riskTooltipText = isOpen ? riskDescription + textCombined : riskDescription + textLayers;

  const { width, height } = useWindowSize();

  return (
    <div className={styles.DataTabToggle} onClick={toggleOpen}>
      <div className={styles.dataTabTitle}>
        <h3 className={styles.dataTabTitleText}>Risks Along the Journey</h3>
      </div>
      <button className={styles.toggleButton}>
        {width >= 480 && <h5 className={styles.expandText}>{isOpen ? 'Hide' : 'Explore'} data</h5>}
        {isOpen ? (
          <span className="material-symbols-outlined">expand_more</span>
        ) : (
          <span className="material-symbols-outlined">expand_less</span>
        )}
      </button>
      <InfoTooltipWrapper text={riskTooltipText} placement="right" disabled={width < 480}>
        {width >= 480 && (
          <span
            className="material-symbols-outlined"
            style={{
              pointerEvents: 'all !important',
              marginLeft: '0.1rem',
              fontSize: '1.2rem',
              color: '#985946',
              fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0",
              transform: 'translateY(-0.15rem)',
            }}
          >
            info
          </span>
        )}
      </InfoTooltipWrapper>
    </div>
  );
}
