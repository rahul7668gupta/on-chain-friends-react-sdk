import fs from 'fs';

interface Social {
  dappName: string;
  profileImageContentValue?: {
    image: {
      extraSmall: string;
    };
  };
  profileImage: string;
}

function getPreferredProfileImage(socials: Social[] = []): string {
  if (!socials || socials.length === 0) {
    return "";
  }
  let lensImage: string | undefined;
  const lensSocial = socials.find((social) => social.dappName === 'lens');
  if (lensSocial) {
    lensImage = lensSocial.profileImageContentValue?.image?.extraSmall || lensSocial.profileImage;
  }
  let farcasterImage: string | undefined;
  const farcasterSocial = socials.find((social) => social.dappName === 'farcaster');
  if (farcasterSocial) {
    farcasterImage = farcasterSocial.profileImage;
  }

  if (lensImage && farcasterImage && isIpfsUrl(lensImage)) {
    return farcasterImage;
  }
  if (!lensImage && farcasterImage) {
    return farcasterImage;
  }
  if (lensImage && !farcasterImage) {
    return lensImage;
  }

  return "";
}

function isIpfsUrl(url: string): boolean {
  return url.startsWith('ipfs://');
}

function writeJsonArrayToFile(filename: string, jsonArray: any[]): void {
  const jsonData = JSON.stringify(jsonArray, null, 2);

  try {
    fs.writeFileSync(filename, jsonData);
    console.log(`JSON array successfully written to ${filename}`);
  } catch (err: any) {
    console.error('Error writing to file:', err);
  }
}

const writeMapToFile = (map: Map<string, any>, filePath: string): void => {
  try {
    // Convert the Map to a plain JavaScript object
    const plainObject: Record<string, any> = {};
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
};

const readJsonArrayFromFile = (filePath: string): any[] | null => {
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
};

export {
  writeJsonArrayToFile,
  writeMapToFile,
  readJsonArrayFromFile,
  getPreferredProfileImage
};
