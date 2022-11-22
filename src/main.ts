import {
  connection as con,
  client as cli,
  disconnect as dis,
  skipSound as skip,
  play,
  joinServer,
  playSelectedSound,
} from "@components/lib";
import {helpMePls} from "@components/message"
require("dotenv").config();

const client = cli();

client.once("ready", () => {
  console.log("ready");
  // @ts-ignore: Unreachable code error
  client.user.setActivity("MUSIC | !help", {
    type: "PLAYING",
  });
});

client.on("messageCreate", async (msg: any) => {
  switch (true) {
    case msg.content == "!join":
      joinServer(msg);
      break;

    case msg.content == "!disconnect":
      dis();
      break;

    case msg.content.indexOf("!play") == 0:
      play(msg);
      break;

    case msg.content == "!skip":
      skip(msg);
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

client.login(process.env.TOKEN);
