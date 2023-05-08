import * as d3 from 'd3';
import { useEffect } from 'react';

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
    <div style={{ display: 'flex', textAlign: 'center', alignItems: 'center', gap: '0.5rem' }}>
      <input
        type="text"
        value={riskWeight}
        onChange={validateAndUpdate}
        style={{
          width: '30px',
          height: '20px',
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.7rem',
          fontWeight: '500',
          textAlign: 'center',
          border: '1.5px solid var(--gray)',
          borderRadius: '4px',
          color: 'var(--brown)',
        }}
      />
      <label class='label-pct'>%</label>
    </div>
  );
};

export default RiskWeightTextInput;
