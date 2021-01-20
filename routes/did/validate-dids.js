function validateDIDFormat(did) {
  const whitespaceAfterLeadingPlusRegex = /(\+|00)(\s+)/;
  const matchWhitespacesRegex = /\s/;
  const threeDigitsDIDRegex = /(\+|00){1}\d{3}/;
  const sixToThirteenDigitsRegex = /(\+|00){1}\d{6,13}/;
  const standardizedDID = did.replace(matchWhitespacesRegex, '');

  return did && (typeof did === 'string') && !whitespaceAfterLeadingPlusRegex.test(did) && (threeDigitsDIDRegex.test(standardizedDID) ||  sixToThirteenDigitsRegex.test(standardizedDID));
}

function validateDIDPrefix({ inputDID, prefixes }) {
  const whitespaceTrimmedDIDRegex = /\s/;
  const leadingPlusDIDRegex = /^(\+|00)/;

  const standardizedDID = inputDID.replace(whitespaceTrimmedDIDRegex, '').replace(leadingPlusDIDRegex, '');
  return prefixes.find(prefix => standardizedDID.startsWith(prefix));
}

function validateListOfDIDs({ validPrefixes, inputDIDs }) {
  const prefixes = {};
  const invalidDIDs = [];
  
  if (!prefixes || prefixes.length === 0) throw new Error('Prefixes list not provided');
  if (!inputDIDs || inputDIDs.length ===0) throw new Error('Input DIDs list not provided');

  inputDIDs.forEach(inputDID => {
    const validDIDFormat = validateDIDFormat(inputDID);
    const prefix = validateDIDPrefix({ inputDID: inputDID, prefixes: validPrefixes });

    if (!validDIDFormat || !prefix) {
      invalidDIDs.push(inputDID);
    } else if (prefix && !prefixes[prefix]) {
      prefixes[prefix] = [inputDID];
    } else if (prefix && prefixes[prefix]) {
      prefixes[prefix].push(inputDID);
    }
  });

  return {
    prefixes: prefixes,
    invalidDIDs: invalidDIDs,
  }
}

module.exports = { validateListOfDIDs };