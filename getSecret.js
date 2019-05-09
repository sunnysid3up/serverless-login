const AWS = require("aws-sdk");
const fs = require("fs");
const region = "ap-northeast-2";
const SecretId = "wm-auth-basics";
let secret, decodedBinarySecret;

const client = new AWS.SecretsManager({ region });

client.getSecretValue({ SecretId }, (err, data) => {
  if (err) {
    console.log("write secret fail.");
    throw err;
  }
  if ("SecretString" in data) {
    secret = data.SecretString;
  } else {
    const buff = new Buffer(data.SecretBinary, "base64");
    decodedBinarySecret = buff.toString("ascii");
  }
  fs.readdir("./config", (err, files) => {
    if (err) {
      fs.mkdirSync("./config");
    }
    fs.writeFile(
      "./config/secrets.json",
      secret || decodedBinarySecret,
      err => {
        if (err) {
          throw err;
        }
        console.log("write secret success");
      }
    );
  });
});
