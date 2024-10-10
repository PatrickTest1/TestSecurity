const crypto = require('crypto');

const keyPart1 = "akdsjfh";
const keyPart2 = "9fas8df";
const keyPart3 = "asl89asj";
const hiddenKey = keyPart1 + keyPart2 + keyPart3;

function getSecretKey() {
    const key = hiddenKey.split('').reverse().join('');
    return crypto.createHmac('sha256', key).digest('hex');
}

function makeRequest() {
    const apiKey = getSecretKey();
    console.log("Utilisation de la clé API masquée : ", apiKey);
}

makeRequest();
