import path from 'path';
import { promises as fs } from 'fs';

export default async function handler(req, res) {
  //Find the absolute path of the json directory
  const jsonDirectory = path.join(process.cwd(), 'json');
  //Read the json data file data.json
  const fileContents = await fs.readFile(
    jsonDirectory + '/transect-items.json',
    'utf8',
  );
  let obj= null
  if (req.query.id === 'risks') {
    obj = JSON.parse(fileContents).risks
    console.log("RISK",obj)
  } else if (req.query.id ==='borders') {
    obj = JSON.parse(fileContents).borders
    console.log("BORDER", obj)
  }


  //Return the content of the data file in json format
  res.status(200).json(obj);
}
