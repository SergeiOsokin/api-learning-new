const crypto = require('crypto');

const getPassword = (length) => {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let password = '';
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    password += chars[array[i] % chars.length]; // % operator returns remainder of division
  }
  return password;
};

module.exports = {
  getPassword,
};
