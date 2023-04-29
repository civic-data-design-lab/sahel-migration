/**
 * Simple controlled slider component.
 */

import React from 'react';

const RiskWeightSlider = ({ riskId, riskWeight, onUpdate }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
      <p class="body-4">Risk weight factor</p>
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
