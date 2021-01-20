const https = require('https');

const TALKDESK_HOSTNAME =  'challenge-business-sector-api.meza.talkdeskstg.com';

function getBusinessSector(inputDID) {
  return new Promise((resolve, reject) => {
    let response = '';

    console.info(`Querying data for DID ${inputDID}`);

    const request = https.request({
      hostname: TALKDESK_HOSTNAME,
      path: `/sector/${inputDID.replace(/\s/, '')}`,
      method: 'GET',
      headers: {
        "Accept": "application/json"
      },
    }, (res) => {
      console.debug('statusCode:', res.statusCode);
      console.debug('headers:', res.headers);
    
      res.on('data', (d) => {
        response += d;
      });

      res.on('end', () => {
        resolve(JSON.parse(response));
      });
    });
    
    request.on('error', (e) => {
      reject(e);
    });

    request.end();
  });
}

module.exports = { getBusinessSector }; 
