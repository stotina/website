import bsv from './bsb.1.5.6/bsv.min';

const brfc = (title, authors, version) => {
  const autorString = authors.join(', ').trim();
  const stringToHash = [title.trim() + autorString + (version.toString() || '')].join('').trim();
  let hash = bsv.crypto.Hash.sha256sha256(Buffer.from(stringToHash));
  hash = hash.reverse();
  return hash.toString('hex').substring(0, 12);
};

export { brfc };
//# sourceMappingURL=brfc.esm.js.map
