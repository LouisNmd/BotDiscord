import {
  client as newClient,
  disconnect,
  franky,
  skipSound,
  play,
  pause,
  joinServer,
  playSelectedSound,
  feur,
} from "@components/lib";
import { helpMePls } from "@components/message";
import { addSpeechEvent } from "discord-speech-recognition";
require("dotenv").config();

const client = newClient();
addSpeechEvent(client, {lang: "fr-FR"});

client.once("ready", () => {
  console.log("ready");
  // @ts-ignore: Unreachable code error
  client.user.setActivity("MUSIC | !help", { type: "PLAYING" } );
});

client.on("messageCreate", async (msg: any) => {
  switch (true) {
    case msg.content == "!join":
      joinServer(msg);
      break;

    case msg.content == "!disconnect":
      disconnect();
      break;

    case msg.content == "!franky":
      franky(msg);
      break;

    case msg.content.indexOf("!play") == 0:
      play(msg);
      break;

    case msg.content == "!pause":
      pause(msg);
      break;

    case msg.content == "!skip":
      skipSound(msg);
      break;

    case msg.content == "!!help":
      helpMePls(msg);
      break;

    case (!isNaN(msg.content) && msg.content.trim()!=""):
      playSelectedSound(msg);
      break;

    default:
      break;
  }
});

client.on("speech", (msg) => {
  if (!msg.content) {
    return;
  }
  const messageArray = msg.content.split(" ");
  if (messageArray.slice(-5, messageArray.length).includes("quoi")) {
    feur();
  }
})

client.login(process.env.TOKEN);
