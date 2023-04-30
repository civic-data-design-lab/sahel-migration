const weights = [0, 0.5, 0, 0.5, 0, 0];
const sum = weights.reduce((a, b) => a + b);
console.log('Total risk weight:', sum);
const aggregateWeights = weights.map((weight) => weight / sum);
console.log(aggregateWeights);
