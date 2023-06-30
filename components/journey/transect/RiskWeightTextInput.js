import * as d3 from 'd3';
import { useEffect } from 'react';
import stlyes from '../../../styles/Transect.module.css'


const RiskWeightTextInput = ({ riskId, riskWeight, riskLabel, onUpdate }) => {
  const validateAndUpdate = (e) => {
    const onlyNumeric = e.target.value.replace(/\D/g, '').trim();

    let newVal = 0;
    if (onlyNumeric !== '') {
      newVal = parseInt(onlyNumeric);
    }

    if (newVal > 100) {
      return riskWeight;
    }

    onUpdate(newVal);
  };

  return (
    <div
      className={stlyes.textPercent}

      style={{ display: 'flex', textAlign: 'center', alignItems: 'center', gap: '0.5rem' }}>
      <p
        type="text"
        value={riskWeight}
        style={{
          width: '30px',
          height: '20px',
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.7rem',
          fontWeight: '500',
          textAlign: 'center',
          color: 'var(--brown)',
          marginTop: '-0.2rem',
        }}
      >
        {Math.round(riskWeight * 100)}%
      </p>
      {/* <label className='label-pct'>%</label> */}
    </div>
  );
};

export default RiskWeightTextInput;
