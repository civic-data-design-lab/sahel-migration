import styles from '../../../styles/DataTabToggle.module.css';
import InfoTooltipWrapper from '../../infotooltip';

export default function DataTabToggle({ isOpen, toggleOpen }) {
  const textCombined = 'Click to view the migration risks combined together.';
  const textLayers = 'Click to explore each migration risk further.';
  const riskDescription =
    'Migrants are always at risk while in transit. This migration risk score indicates relative variations of extreme risk with higher values that range from 0-100. The score is a composite of six risk factors: migrant reported violence incidents, conflict events, food insecurity, reliance on smugglers, remoteness, and heat exposure. ';
  let riskTooltipText = isOpen ? riskDescription + textCombined : riskDescription + textLayers;

  return (
    <>
      <button className={styles.toggleButton} onClick={toggleOpen}>
        <h3 className="header-2">Explore the Risks</h3>
        &ensp;
        <InfoTooltipWrapper text={riskTooltipText} placement="right">
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
          {isOpen ? (
            <span
              className="material-symbols-outlined"
              style={{ color: '#463c35', fontSize: '2rem' }}
            >
              expand_more
            </span>
          ) : (
            <span
              className="material-symbols-outlined"
              style={{ color: '#463c35', fontSize: '2rem' }}
            >
              expand_less
            </span>
          )}
        </InfoTooltipWrapper>
      </button>
    </>
  );
}
