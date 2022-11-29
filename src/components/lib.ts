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
import { messagePlaying, messageJoinFirst, messageSearch, messageSkipping, messageNotSkipping } from "@components/message";
import { Item, Root } from "src/model/youtube/searchData";
import { videoURL } from "src/const/youtube-api-uri";

let _connection: any;
let latestItem: Item;
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

const franky = async (msg: any) => {
  if (!msg.member?.voice.channel) {
    messageJoinFirst(msg);
    return;
  } else {
    if (msg?.guild?.voice?.cannel == undefined) {
      connection(msg);
    }
    const bonjour = await createAudioResource('bonjour.mp3');
    await player.play(bonjour);
    const subscribe = _connection.subscribe(player);
    while (player.state.status != AudioPlayerStatus.Idle) {
      await new Promise(r => setTimeout(r, 250));
    }
    await new Promise(r => setTimeout(r, 2000));
    const aurevoir = await createAudioResource('aurevoir.mp3');
    await player.play(aurevoir);
    while (player.state.status != AudioPlayerStatus.Idle) {
      await new Promise(r => setTimeout(r, 250));
    }
    disconnect();
  }
  return;
}

const play = async (msg: any) => {
  if (!msg.member?.voice.channel) {
    messageJoinFirst(msg);
    return;
  } else {
    if (msg.content.replace(/!play/g, "").trim().length == 0) {
      if (player.state.status === AudioPlayerStatus.Paused) {
        player.unpause();
        msg.react('▶️')
        return;
      } else {
        msg.reply("!help");
        return;
      }
    }

    if (msg?.guild?.voice?.channel == undefined) {
      connection(msg);
    }

    if (msg.content.indexOf("youtube.com") >= 0) {
      // Cas d'une recherche par URL
      const searched = await searchById(msg);
      //console.log(searched);
      const path = await playYoutubeFromCommand(msg);
      const resource = await createAudioResource(path[1].url);
      player.play(resource);
      latestItem = searched.items[0]
      messagePlaying(msg, latestItem); //send message
      const subscribe = _connection.subscribe(player);
    } else {
      // Cas d'une recherche par mot clé
      RESULTS = await getSearchResults(NUMBER_OF_RESULT, msg);
      CURRENTLY_SEARCHING = true;
      messageSearch(RESULTS, NUMBER_OF_RESULT, msg);
    }
  }
  return;
};

const pause = (msg: any) => {
  if (!msg.member?.voice.channel) {
    messageJoinFirst(msg);
    return;
  } else {
    player.pause();
    msg.react('⏸️');
  }
}

const playSelectedSound = async (msg: any) => {
  const index: number = parseInt(msg.content);
  if(CURRENTLY_SEARCHING &&  index >= 1 && index <= NUMBER_OF_RESULT) {
    latestItem = RESULTS!.items[index-1];
    const path = await playYoutubeFromURL(videoURL.concat(latestItem.id.videoId));
    const resource = await createAudioResource(path[1].url);
    player.play(resource);
    messagePlaying(msg, latestItem); //send message
    const subscribe = _connection.subscribe(player);
    RESULTS = undefined;
    CURRENTLY_SEARCHING = false;
  }
  return;
}

const skipSound = async (msg: any) => {
  const statusesAllowingSkip = [AudioPlayerStatus.AutoPaused, AudioPlayerStatus.Buffering, AudioPlayerStatus.Paused,AudioPlayerStatus.Playing];
  if (player && statusesAllowingSkip.includes(player.state.status) ) {
    messageSkipping(msg, latestItem);
    await player.stop();
  } else {
    messageNotSkipping(msg);
  }
}


export { client, connection, disconnect, franky, play, pause, joinServer, playSelectedSound, skipSound };
