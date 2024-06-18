const crc32 = require("crc32");
const { v4: uuid } = require("uuid");

exports.generateTicketId = () => {
  const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomLetter1 = alphabet[Math.floor(Math.random() * alphabet.length)];
  const randomLetter2 = alphabet[Math.floor(Math.random() * alphabet.length)];

  const uuid1 = uuid();
  const hash = crc32(uuid1).toString(16);
  return randomLetter1 + randomLetter2 + hash.slice(0, 8);
};
