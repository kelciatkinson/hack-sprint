#!/bin/node
import fs from 'node:fs';
import * as http from 'http';
import {
  BedrockRuntimeClient,
  ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";

const host = '0.0.0.0';
const port = 8080;

const requestListener = async function (req, res) {
    res.writeHead(200);
    const data = await getData("","The user says 'hello'");
    res.end(data);
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});


async function getData(characterBio, userMessage) {
  const AWS_config = {
   region: 'us-east-1',
   credentials: { accessKeyId: 'AKIAW6X74OAGRZSG3O3N',
   secretAccessKey: '' }
  };
  const client = new BedrockRuntimeClient(AWS_config);
  const modelId = "anthropic.claude-3-haiku-20240307-v1:0";
  const conversation = [
    {
      role: "user",
      content: [{ text: userMessage }],
    },
  ];
  const systemText = [{text: "You are Ursula on a dating site, having a conversation with a user looking for a potential relationship. Here is Ursula's bio 'I'm Ursula. I'm a woman of my word, and you better be too. Lest there be grave consequences. Hehe. Only joking. I like to make waves, eat sushi, and be the most powerful individual in the room. I am a person who is rather sure of myself, so if you feel like you can handle that, feel free to swim into my dms. I hate family because of my own treating me most poorly. I hope you keep family low on your priority list too. I am assertive and assured, and need someone who is willing to let me be number one."}]
  characterBio = systemText;
  const response = await client.send(
    new ConverseCommand({ modelId, system: systemText, messages: conversation }),
  );

  const responseText = response.output.message.content[0].text;
  return responseText;
}

function readFromFile(filePath) {
  try {
    const data = fs.readFileSync('filePath', { encoding: 'utf8' });
    return (data);
  } catch (err) {
    console.log(err);
    return ("error: " + err);
  }
}
