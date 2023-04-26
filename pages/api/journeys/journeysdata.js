import path from 'path';
import { promises as fs } from 'fs';

export default async function handler(req, res) {
  //Find the absolute path of the json directory
  const jsonDirectory = path.join(process.cwd(), 'json');
  //Read the json data file data.json
  const fileContents = await fs.readFile(jsonDirectory + '/journeys-items.json', 'utf8');
  if (req.query.id === 'all') {
    const obj = JSON.parse(fileContents).items.journeys;
    //Return the content of the data file in json format
    res.status(200).json(obj);
  } else {
    const obj = JSON.parse(fileContents).items.journeys.find(
      (journey) => journey.id == req.query.id
    );
    //Return the content of the data file in json format
    res.status(200).json(obj);
  }
}
