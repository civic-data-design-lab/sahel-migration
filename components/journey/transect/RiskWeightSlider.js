/**
 * Simple controlled slider component.
 */

import React from 'react';

const RiskWeightSlider = ({ riskId, riskWeight, onUpdate }) => {
  return (
    <input
      type="range"
      value={riskWeight}
      min={0}
      max={100}
      step={1}
      onChange={(e) => onUpdate(e.target.value)}
    />
  );
};

export default RiskWeightSlider;
