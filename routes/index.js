const express = require('express');
const router = express.Router();

const { loadPrefixes } = require('./prefixes/load-prefixes');
const { validateListOfDIDs } = require('./did/validate-dids');
const { getSectorCountForListOfDIDs } = require('./api/talkdesk-service');

router.post('/aggregate', async function(req, res, next) {
  let prefixes;

  try {
    prefixes = await loadPrefixes();

    console.debug(`${prefixes.length} prefixes loaded.`);
  } catch (e) {
    console.error(e);

    res.sendStatus(500);
  } 

  const validatedDIDs = validateListOfDIDs({ validPrefixes: prefixes, inputDIDs: req.body });

  console.debug(`Validation result: ${JSON.stringify(validatedDIDs)}.`);

  if (validatedDIDs.invalidDIDs.length > 0) {
    const invalidDIDs = validatedDIDs.invalidDIDs.join(',');

    console.debug(`Invalid DIDs: ${invalidDIDs}`);
    
    res.status(400).send({ errorCode: 01, errorMessage: `The following DIDs are invalid: ${invalidDIDs}`})
  } else {
    const countsPerPrefix = {};

    for (const prefix in validatedDIDs.prefixes) {
      const dids = validatedDIDs.prefixes[prefix];
      countsPerPrefix[prefix] = await getSectorCountForListOfDIDs(dids);
    }

    res.status(200).send(JSON.stringify(countsPerPrefix));
  }
});

module.exports = router;
