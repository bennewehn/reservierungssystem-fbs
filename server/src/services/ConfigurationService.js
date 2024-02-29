import fs from "fs/promises";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = dirname(__dirname) + "/config.json";

export default class ConfigurationService {
  // Save key-value pair
  static saveKeyValuePair = async (key, value) => {
    try {
      // Read data from file
      let data = await fs.readFile(filePath);
      data = JSON.parse(data);

      // Update key-value pair
      data[key] = value;

      // Write data back to file
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Error saving key-value pair:", error);
    }
  };

  // Retrieve value by key asynchronously
  static getValueByKey = async (key) => {
    try {
      // Read data from file
      const data = await fs.readFile(filePath);
      const jsonData = JSON.parse(data);

      // Return value for given key
      return jsonData[key];
    } catch (error) {
      console.error("Error getting value by key:", error);
      return null;
    }
  };
}
