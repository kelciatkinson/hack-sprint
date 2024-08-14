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
const secret = readFromFile('secret.txt').replace("\n",""); 
const AWS_config = {
  region: 'us-east-1',
  credentials: { accessKeyId: 'AKIAW6X74OAGRZSG3O3N',
  secretAccessKey: secret }
};

const privateKey = fs.readFileSync('private.key', 'utf8');
const certificate = fs.readFileSync('certificate.crt', 'utf8');
const credentials = {key: privateKey, cert: certificate};
const util = require('util');

const requestListener = async function (req, res) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
    'Access-Control-Max-Age': 60 };
  //  res.writeHead(200);
  //  const data = await getData("","The user says 'hello'");
  //  res.end(data);
  if (req.method === 'POST') {
    if (req.url === '/pull') {
      res.writeHead(200, headers);
      pull();
      res.end("PULL");
      return;
    } else {
      let data = '';
      req.on('data', chunk => {
        data += chunk.toString();
      });
      req.on('end', async () => {
        console.log('POST data:', data);
        data = JSON.parse(data);
        let characterResponse = await getData(data.characterName, data.characterBio, data.userMessage);
        res.writeHead(200, headers);
        res.end(JSON.stringify({characterResponse}));
        return;
      });
    }
  } else {
    if (req.url === '/pull') {
        res.writeHead(200, headers);
        pull();
        res.end("PULL");
        return;
    } else {
      res.writeHead(200, headers);
      res.end(readFromFile('data.json'));
      return;
    }
  }
};

const server = https.createServer(credentials, requestListener);
server.listen(port, host, () => {
    console.log(`Server is now running on https://${host}:${port}`);
});


async function getData(characterName, characterBio, userMessage) {

  console.log(AWS_config);
  const client = new BedrockRuntimeClient(AWS_config);
  const modelId = "anthropic.claude-3-haiku-20240307-v1:0";
  const conversation = [
    {
      role: "user",
      content: [{ text: userMessage }],
    },
  ];
  const systemText = [{text: `You are ${characterName} on a dating site,` +
    ` having a conversation with a user looking for a potential relationship.` +
    ` Here is ${characterName}'s bio: '${characterBio}'`}]
  const response = await client.send(
    new ConverseCommand({ modelId, system: systemText, messages: conversation }),
  );

  const responseOutput = response.output;
  console.log("responseOutput: " + responseOutput.toString());
  const responseOutputMessage = responseOutput.message;
  console.log("responseOutputMessage: " + responseOutputMessage.toString());
  const responseOutputMessageContent = responseOutputMessage.content;
  console.log("responseOutputMessageContent: " + responseOutputMessageContent.toString());
  const responseOutputMessageContentText = responseOutputMessageContent[0].text;
  console.log("responseOutputMessageContentText: " + responseOutputMessageContentText.toString());
  

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

function pull() {
  const { exec } = require('child_process');
  var yourscript = exec('sudo /var/www/update.sh', 
    ( error, stdout, stderr) => {
      console.log(stdout);
      console.log(stderr);
      if (error !== null) {
         console.log(`exec error: ${error}`);
      }
  });
}
