#!/usr/bin/node
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const https = require('https');
import fs from 'node:fs';
import * as http from 'http';
import {
  BedrockRuntimeClient,
  ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";

const host = '0.0.0.0';
const port = 8080;
const secret = readFromFile('secret.txt'); 
const AWS_config = {
  region: 'us-east-1',
  credentials: { accessKeyId: 'AKIAW6X74OAGRZSG3O3N',
  secretAccessKey: secret }
};

const privateKey = fs.readFileSync('private.key', 'utf8');
const certificate = fs.readFileSync('certificate.crt', 'utf8');
const credentials = {key: privateKey, cert: certificate};

const requestListener = async function (req, res) {
  //  res.writeHead(200);
  //  const data = await getData("","The user says 'hello'");
  //  res.end(data);
  if (req.method === 'POST') {
    let data = '';
    req.on('data', chunk => {
        data += chunk.toString();
    });
    req.on('end', async () => {
        console.log('POST data:', data);
        data = JSON.parse(data);
        let characterResponse = await getData(data.characterName, data.characterBio, data.userMessage);
        res.end(JSON.stringify({characterResponse}));
      });
    } else {
      if (req.method == 'GET') {
        //if (req.query.pull != undefined) {
          res.end(JSON.stringify(req));
        //}
      } else {
        res.end(readFromFile('data.json'));
      }
    }
};

const server = https.createServer(credentials, requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});


async function getData(characterName, characterBio, userMessage) {

  const client = new BedrockRuntimeClient(AWS_config);
  const modelId = "anthropic.claude-3-haiku-20240307-v1:0";
  const conversation = [
    {
      role: "user",
      content: [{ text: userMessage }],
    },
  ];
  const systemText = [{text: `You are ${characterName} on a dating site, having a conversation with a user looking for a potential relationship. Here is ${characterName}'s bio: '${characterBio}'`}]
  characterBio = systemText;
  const response = await client.send(
    new ConverseCommand({ modelId, system: systemText, messages: conversation }),
  );

  const responseText = response.output.message.content[0].text;
  return responseText;
}

function readFromFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, { encoding: 'utf8' });
    return (data);
  } catch (err) {
    console.log(err);
    return ("error: " + err);
  }
}
