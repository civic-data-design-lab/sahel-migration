import * as d3 from 'd3';
import { useEffect } from 'react';
import useWindowSize from '../../../hooks/useWindowSize';
import InfoTooltipWrapper from '../../infotooltip';

const RiskLabel = ({ riskId, riskLabel, riskDescription }) => {
  const { width, height } = useWindowSize();

  return (
    <div style={{ display: 'flex', textAlign: 'left', alignItems: 'left', gap: '0.5rem' }}>
      <InfoTooltipWrapper text={riskDescription} placement="right">
        <span
          type="text"
          className="label-risk"
          value={riskId}
          style={{
            marginTop: '-0.2rem',
            marginBottom: '0rem',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <p
            type="text"
            className="label-risk"
            value={riskId}
            style={{
              marginTop: '-0.2rem',
              marginBottom: '0rem',
              fontFamily: "'Inter', sans-serif",
              fontWeight: '500',
              fontSize: width > 480 ? '0.85rem' : '0.6rem',
              color: 'var(--brown)',
            }}
          >
            {riskLabel}
          </p>
            <span
              className="material-symbols-outlined"
              style={{
                pointerEvents: 'all !important',
                marginLeft: '0.5rem',
                fontSize: '0.8rem',
                color: '#985946',
                fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0",
                // transform: width < 480 ? 'translateY(-.25px)' : 'none',
              }}
            >
              info
            </span>
        </span>
      </InfoTooltipWrapper>
    </div>
  );
};

export default RiskLabel;
