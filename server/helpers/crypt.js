var CryptoJS, default_salt;

CryptoJS = require("crypto-js");

default_salt = 'random-hash';

exports.encrypt = function(key, salt) {
  return CryptoJS.AES.encrypt(key, salt).toString();
};

exports.decrypt = function(hash, salt) {
  return CryptoJS.AES.decrypt(hash, salt).toString(CryptoJS.enc.Utf8);
};

exports.getRandomHash = function() {
  var key;
  key = default_salt + Date.now();
  return CryptoJS.SHA256(key).toString();
};