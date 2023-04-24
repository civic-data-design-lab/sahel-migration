
const fs = require("fs");

const inputFile = "input.json";

fs.readFile(inputFile, (err, data) => {
  if (err) {
    console.error(`Error reading input file: ${err}`);
    return;
  }

  const inputObj = JSON.parse(data);
  // Flatten the input object here
  console.log(inputObj);
});
