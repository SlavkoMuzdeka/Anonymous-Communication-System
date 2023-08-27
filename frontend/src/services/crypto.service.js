import forge from "node-forge";

export const convertCertToDer = (encCert) =>
  forge.pki.certificateFromPem(forge.util.decode64(encCert));

export const convertPrivKeyToDer = (encPrivKey) =>
  forge.pki.privateKeyFromPem(forge.util.decode64(encPrivKey));

export const genSymmetricKey = (keyLengthInBytes) => {
  const key = forge.random.getBytesSync(keyLengthInBytes);
  const iv = forge.random.getBytesSync(keyLengthInBytes);
  return { key, iv, alg: "AES-CBC" };
};

export const signData = (data, privateKey) => {
  const md = forge.md.sha256.create();
  md.update(JSON.stringify(data), "utf8");
  const signature = privateKey.sign(md);
  return forge.util.encode64(signature);
};

export const encryptWithSymmetricKey = (symmetricKey, data) => {
  const cipher = forge.cipher.createCipher(symmetricKey.alg, symmetricKey.key);
  cipher.start({ iv: symmetricKey.iv });
  cipher.update(forge.util.createBuffer(JSON.stringify(data)));
  cipher.finish();
  return cipher.output;
};

export const verifyData = (data, publicKey, signature) => {
  const md = forge.md.sha256.create();
  md.update(JSON.stringify(data), "utf8");
  return publicKey.verify(md.digest().bytes(), forge.util.decode64(signature));
};

export const decryptWithSymmetricKey = (symmetricKey, data) => {
  const decipher = forge.cipher.createDecipher(
    symmetricKey.alg,
    symmetricKey.key
  );
  decipher.start({ iv: symmetricKey.iv });
  decipher.update(forge.util.createBuffer(data));
  decipher.finish();
  return JSON.parse(decipher.output);
};

export const cryptoService = {
  convertCertToDer,
  convertPrivKeyToDer,
  genSymmetricKey,
  signData,
  encryptWithSymmetricKey,
  verifyData,
  decryptWithSymmetricKey,
};

export default cryptoService;
