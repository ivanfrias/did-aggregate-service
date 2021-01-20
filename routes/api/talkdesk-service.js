const { getBusinessSector } = require('./talkdesk-api-client');

async function getSectorCountForListOfDIDs(dids) {
  const sectors = {};
  const promises = dids.map(async did => {
    return new Promise(async resolve => {
      let response;

      try {
        response = await getBusinessSector(did);
      } catch (error) {
        console.error(error);
      }
      resolve(response);
    })
  });

  const results = (await Promise.all(promises)).filter(result => result);

  results.forEach(result => {
    if (!sectors[result.sector]) {
      sectors[result.sector] = 1;
    } else {
      sectors[result.sector] += 1;
    }
  });

  return sectors;
}

module.exports = { getSectorCountForListOfDIDs };