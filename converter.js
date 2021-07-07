//Import 
import fs from 'fs';
import jq from 'node-jq';

//variable declaration
const pathInput = './export/json/';
const pathOutput = './export/ndjson/';
const fileExtensionSource = '.json';
const fileExtensionExport = '.json';

const writeSanityObjectToFileSyncAsNdjson = fileName => {
  const fileNameWithoutExtension = fileName.replace(fileExtensionSource, '');
  const fileNameOutput = `${fileNameWithoutExtension}NDJSON${fileExtensionExport}`;
  const pathOutputWithFileName = fileNameOutput.replace(pathInput, pathOutput);
  console.log(`\n`);
  jq.run('.[]', fileName, { output: 'compact' })
    .then((output) => {
      fs.writeFileSync(pathOutputWithFileName, output);
      console.log(`✨ The file '${fileName}' was converted to NDJSON!`);
    })
    .catch((err) => {
      console.error(`🐛  Something went wrong: ${err}`);
    });
  };

//Converter method
const jsonToNDJSON = () => {
  if (!fs.existsSync(pathInput)) {
    console.log(`dir: ${pathInput} does not exist!`);
    return;
  }
  const files = fs.readdirSync(pathInput);
  files.forEach((fileName) => {
    if (fileName !== '.DS_Store') {
      const pathInputWithFileName = `${pathInput}${fileName}`;
      const stat = fs.lstatSync(pathInputWithFileName);
      const regex = new RegExp(`([\\s]*?)${fileExtensionSource}`, "gi");
      if (!stat.isDirectory() && regex.test(pathInputWithFileName)) {
        writeSanityObjectToFileSyncAsNdjson(pathInputWithFileName);
      };
    }
  });
};

jsonToNDJSON();
