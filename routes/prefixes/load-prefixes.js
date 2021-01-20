const path = require('path');
const fs = require('fs');

const PREFIX_FILE_NAME = "prefixes.txt";

async function loadPrefixes() {
  let prefixesList = [];
 
  console.debug(`Prefixes not yet loaded...loading.`);

  const filePath = path.join(__dirname, PREFIX_FILE_NAME);
  const prefixes = await fs.promises.readFile(filePath);
  prefixesList = prefixes.toString().split('\n');

  console.debug(`Done.`);

  return prefixesList;
}

module.exports = { loadPrefixes };

