import fs from 'fs';
import { calculatingScore, transformData, createAddressMap, fetchOnChainGraphData } from "./index.ts";
import { Link, Node } from "./src/transform.ts";
import { init } from '@airstack/airstack-react';

// Initialize Airstack
init(process.env.AIRSTACK_API_KEY || '');

// Example: Fetch on-chain graph data
const onChainGraphUsers = await fetchOnChainGraphData(process.env.IDENTITY_OR_ADDRESS || '');

// Write on-chain graph data to a file
writeJsonArrayToFile('./onChainGraphUsers.json', onChainGraphUsers);
const onChainGraphUsersFromJson = readJsonArrayFromFile("./onChainGraphUsers.json") || [];

// Calculate score for each user
const onChainGraphUsersWithScore = onChainGraphUsersFromJson.map((user: any) => calculatingScore(user));
console.log(onChainGraphUsersWithScore.length);

// Write on-chain graph data with score to a file
writeJsonArrayToFile('./onChainGraphWithScore.json', onChainGraphUsersWithScore);

// Read on-chain graph data with score from a file
const onChainGraphWithScore = readJsonArrayFromFile("./onChainGraphWithScore.json") as any[];

// Create an address map
const addressMap = createAddressMap(onChainGraphWithScore) || new Map<string, any>();
writeMapToFile(addressMap, './addressMap.json');

// Transform on-chain graph data to match the format of the visualization tool
const visualisationData = transformData(onChainGraphWithScore, addressMap, onChainGraphWithScore.length);
writeNodesAndLinksToFile('./visualisationData.json', visualisationData);

// Utility function to write a JSON array to a file
function writeJsonArrayToFile(filename: string, jsonArray: any[]): void {
  const jsonData = JSON.stringify(jsonArray, null, 2);

  try {
    fs.writeFileSync(filename, jsonData);
    console.log(`JSON array successfully written to ${filename}`);
  } catch (err) {
    console.error('Error writing to file:', err);
  }
}

// Utility function to write a JSON array to a file
function writeNodesAndLinksToFile(filename: string, data: { nodes: Node[]; links: Link[] }): void {
  const jsonData = JSON.stringify(data, null, 2);

  try {
    fs.writeFileSync(filename, jsonData);
    console.log(`JSON array successfully written to ${filename}`);
  } catch (err) {
    console.error('Error writing to file:', err);
  }
}

// Utility function to write a Map to a file
function writeMapToFile(map: Map<string, any>, filePath: string): void {
  try {
    // Convert the Map to a plain JavaScript object
    const plainObject: { [key: string]: any } = {};
    map.forEach((value, key) => {
      plainObject[key] = value;
    });

    // Convert the object to a JSON string
    const jsonString = JSON.stringify(plainObject, null, 2);

    // Write the JSON string to the file
    fs.writeFileSync(filePath, jsonString, 'utf8');

    console.log('Map has been successfully written to the file.');
  } catch (error: any) {
    console.error(`Error writing Map to file: ${error.message}`);
  }
}

// Utility function to read a JSON array from a file
function readJsonArrayFromFile(filePath: string): any[] | null {
  try {
    // Read the file synchronously
    const jsonData = fs.readFileSync(filePath, 'utf8');

    // Parse the JSON data
    const jsonArray = JSON.parse(jsonData);

    // Check if the parsed data is an array
    if (Array.isArray(jsonArray)) {
      return jsonArray;
    } else {
      throw new Error('The content of the file is not a JSON array.');
    }
  } catch (error: any) {
    console.error(`Error reading JSON array from file: ${error.message}`);
    return null;
  }
}
