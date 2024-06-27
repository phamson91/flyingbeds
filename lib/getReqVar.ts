import CryptoJS from 'crypto-js';

interface IReqVar {
  saltedLssPass: string;
  nonceBase64: string;
  timestamp: string;
}

function generateRandomString() {
  var text = '';
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < 12; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

function toBase64(inputBytes: CryptoJS.lib.WordArray) {
  return CryptoJS.enc.Base64.stringify(inputBytes);
}

function toBytes(inputString: string) {
  return CryptoJS.enc.Utf8.parse(inputString);
}

function saltPassword(nonce: string, timestamp: string, password: string) {
  var sha1 = CryptoJS.algo.SHA1.create();
  sha1.update(nonce);
  sha1.update(timestamp);
  sha1.update(CryptoJS.SHA1(password));
  return toBase64(sha1.finalize());
}

const getReqVar = (): IReqVar => {
  if (!process.env.LSSPassword) {
    throw new Error('Missing password');
  }

  const password = process.env.LSSPassword;
  const nonce = generateRandomString();

  const timestamp = new Date().toISOString();
  const saltedLssPass = saltPassword(nonce, timestamp, password);
  const nonceBase64 = toBase64(toBytes(nonce));

  return {
    saltedLssPass,
    nonceBase64,
    timestamp,
  };
};

export default getReqVar;
