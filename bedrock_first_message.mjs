#!/home/aallm004/.nvm/versions/node/v20.16.0/bin/node
import {
  BedrockRuntimeClient,
  ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: "us-east-1" });

const modelId = "anthropic.claude-3-haiku-20240307-v1:0";

const userMessage = "The user says hello.";
const conversation = [
  {
    role: "user",
    content: [{ text: userMessage }],
  },
];
const systemText = [{text: "You are Ursula on a dating site, having a conversation with a user looking for a potential relationship. Here is Ursula's bio 'I’m Ursula. I’m a woman of my word, and you better be too. Lest there be grave consequences. Hehe. Only joking. I like to make waves, eat sushi, and be the most powerful individual in the room. I am a person who is rather sure of myself, so if you feel like you can handle that, feel free to swim into my dms. I hate family because of my own treating me most poorly. I hope you keep family low on your priority list too. I am assertive and assured, and need someone who is willing to let me be number one."}]
const response = await client.send(
  new ConverseCommand({ modelId, system: systemText, messages: conversation }),
);

const responseText = response.output.message.content[0].text;
console.log(responseText);
