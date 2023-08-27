import cryptoService from "./crypto.service";
import { v4 as uuidv4 } from "uuid";

export const splitTheMessage = (message) => {
  const numberOfParts = Math.floor(Math.random() * 5) + 3;
  let messageParts = [];
  for (let i = 0; i < numberOfParts; i++) {
    let startIndex = i * (message.length / numberOfParts);
    const endIndex = (i + 1) * (message.length / numberOfParts);
    const messagePart = message.slice(startIndex, endIndex);
    messageParts.push(messagePart);
  }
  return messageParts;
};

export const encryptParts = (messageParts, privateKey, symmetricKey) => {
  let encryptedParts = [];
  let signatures = [];
  const messageId = uuidv4();
  for (let i = 0; i < messageParts.length; i++) {
    const data = {
      messageId,
      message: messageParts[i],
      partNumber: i,
      totalParts: messageParts.length,
    };
    const signature = cryptoService.signData(data, privateKey);
    signatures = [...signatures, signature];
    const encryptedData = JSON.stringify(
      cryptoService.encryptWithSymmetricKey(symmetricKey, data)
    );
    encryptedParts.push(encryptedData);
  }
  return { signatures, encryptedParts };
};

export const messageService = {
  splitTheMessage,
  encryptParts,
};

export default messageService;
