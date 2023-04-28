import * as d3 from 'd3';
import { useEffect } from 'react';

const RiskWeightTextInput = ({ riskId, riskWeight, riskLabel, onUpdate }) => {
  // useEffect(() => {
  //   const riskLabelRefId = `#viz-transect-${riskId}`;
  //   const svg = d3.select(svgRef.current);
  //   console.log(svg);
  //   const riskLabelRef = svg.select(riskLabelRefId);

  //   try {
  //     console.log(riskLabelRef);
  //     const x = riskLabelRef.attr('x');
  //     console.log(x);
  //   } catch {
  //     console.warn(`Could not find ${riskLabelRefId}`);
  //   }
  // }, [svgRef.current]);

  return (
    <>
      <input
        type="text"
        value={riskWeight}
        onChange={(e) => onUpdate(e.target.value.replace(/\D/g, ''))}
      />
    </>
  );
};

export default RiskWeightTextInput;
