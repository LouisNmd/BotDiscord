import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} from "@discordjs/voice";
import { Client, Intents, MessageEmbed } from "discord.js";
import {
  playYoutubeFromURL,
  getSearchResults,
  youtubeBySearch,
  searchById,
  playYoutubeFromCommand,
} from "@components/youtube";
import { messagePlaying, messageJoinFirst, messageSearch } from "@components/message";
import { Item, Root } from "src/model/youtube/searchData";
import { videoURL } from "src/const/youtube-api-uri";

let _connection: any;
const player = createAudioPlayer();
const NUMBER_OF_RESULT = 5;
var CURRENTLY_SEARCHING = false;
var RESULTS: Root | undefined;

const client = () => {
  return new Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MEMBERS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_VOICE_STATES,
    ],
  });
};

const connection = (msg: any) => {
  _connection = joinVoiceChannel({
    channelId: msg.member?.voice.channel?.id as string,
    guildId: msg.member?.guild.id as string,
    // @ts-ignore: Unreachable code error
    adapterCreator: msg.channel.guild.voiceAdapterCreator,
  });
};

const joinServer = (msg: any) => {
  if (!msg.member?.voice.channel) {
    messageJoinFirst(msg);
  } else {
    connection(msg);
  }
};

const disconnect = () => {
  RESULTS = undefined;
  CURRENTLY_SEARCHING = false;
  _connection.destroy();
  _connection = undefined;
};

const play = async (msg: any) => {
  if (!msg.member?.voice.channel) {
    messageJoinFirst(msg);
    return;
  } else {
    if (msg.content.replace(/!play/g, "").trim().length == 0) {
      msg.reply("!help");
      return;
    }
    if (msg?.guild?.voice?.cannel == undefined) {
      connection(msg);
    }
    if (msg.content.indexOf("youtube.com") >= 0) {
      // Cas d'une recherche par URL
      const searched = await searchById(msg);
      //console.log(searched);
      const path = await playYoutubeFromCommand(msg);
      const resource = await createAudioResource(path[1].url);
      //player.play(resource);
      messagePlaying(msg, searched.item[0]); //send message
      //const subscribe = _connection.subscribe(player);
    } else {
      // Cas d'une recherche par mot clé
      RESULTS = await getSearchResults(NUMBER_OF_RESULT, msg);
      CURRENTLY_SEARCHING = true;
      messageSearch(RESULTS, NUMBER_OF_RESULT, msg);
    }
  }
  return;
};

const playSelectedSound = async (msg: any) => {
  const index: number = parseInt(msg.content);
  if(CURRENTLY_SEARCHING &&  index >= 1 && index <= NUMBER_OF_RESULT) {
    const videoToPlay: Item = RESULTS!.items[index-1];
    const path = await playYoutubeFromURL(videoURL.concat(videoToPlay.id.videoId));
    const resource = await createAudioResource(path[1].url);
    player.play(resource);
    messagePlaying(msg, videoToPlay); //send message
    const subscribe = _connection.subscribe(player);
    RESULTS = undefined;
    CURRENTLY_SEARCHING = false;
  }
  return;
}

export { client, connection, disconnect, play, joinServer, playSelectedSound };
