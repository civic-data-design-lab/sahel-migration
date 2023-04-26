import path from 'path';
import { promises as fs } from 'fs';

export default async function handler(req, res) {
  //Find the absolute path of the json directory
  const jsonDirectory = path.join(process.cwd(), 'json');
  //Read the json data file data.json
  const fileContents = await fs.readFile(jsonDirectory + '/transect-small.json', 'utf8');
  let obj = null;

  switch (req.query.id) {
    case 'risks':
      obj = JSON.parse(fileContents);
      break;
    // case 'borders':
    //   obj = JSON.parse(fileContents).borders
    //   console.log("BORDER", obj)
    //   break;
    // case 'cities':
    //   obj = JSON.parse(fileContents).cities
    //   console.log("CITIES", obj)
    //   break;
  }

  //Return the content of the data file in json format
  res.status(200).json(obj);
}
