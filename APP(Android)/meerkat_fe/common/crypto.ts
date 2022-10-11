import JSEncrypt from "jsencrypt";
import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

import CryptoES from 'crypto-es';

const iv = CryptoES.enc.Hex.parse('a73d36623b1ed23529703e0df0cd36a4');
const genRanHex = (size: number) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

/////////
// RSA //
/////////

export const generateRSAKeys = () => {
  let keys = (new JSEncrypt()).getKey();
  return keys;
}

export const encryptRSA = (msg: string, publicKey: string) => {
  let e = new JSEncrypt();
  e.setPublicKey(publicKey);
  return e.encrypt(msg);
}

export const decryptRSA = (msg: string, privateKey: string) => {
  let e = new JSEncrypt();
  e.setPrivateKey(privateKey);
  return e.decrypt(msg);
}

/////////
// AES // 
/////////

export const generateAESKey = () => {
  //TODO: Math.random이 보안적으로 취약할듯?
  const key = genRanHex(16); 
  return key;
}

export const encryptAES = (msg: string, key: string) => {
  const encrypted = CryptoES.AES.encrypt(msg, CryptoES.enc.Hex.parse(key), {iv: iv});
  return CryptoES.enc.Base64.stringify(encrypted.ciphertext);
}

export const decryptAES = (encrypted: string, key: string) => {
  const decrypted = CryptoES.AES.decrypt({ciphertext: CryptoES.enc.Base64.parse(encrypted)}, CryptoES.enc.Hex.parse(key), {iv: iv});
  return decrypted.toString(CryptoES.enc.Utf8);
}
