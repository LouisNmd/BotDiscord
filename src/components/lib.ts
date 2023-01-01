import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  StreamType,
} from "@discordjs/voice";
import { Client, GatewayIntentBits } from "discord.js";
import {
  playYoutubeFromURL,
  getSearchResults,
  searchById,
  playYoutubeFromCommand,
} from "@components/youtube";
import { 
  messagePlaying,
  messageJoinFirst,
  messageSearch,
  messageSkipping,
  messageNotSkipping,
} from "@components/message";
import { Item, Root } from "src/model/youtube/searchData";
import { videoURL } from "src/const/youtube-api-uri";
import { config } from "src/const/config";

const player = createAudioPlayer();

let _connection: any;
let latestItem: Item;
let latestNonIdleTime: number;
let CURRENTLY_SEARCHING = false;
let RESULTS: Root | undefined;

const client = () => {
  return new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.MessageContent,
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
  autoDisconnect();
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

const autoDisconnect = async () => {
  latestNonIdleTime = Date.now();
  while (_connection && _connection != undefined) {
    if (player.state.status === AudioPlayerStatus.Idle) {
      if ((Date.now() - latestNonIdleTime)/1000 >= config.AUTO_DISCONNECT_SECONDS) {
        disconnect();
        break;
      }
    } else {
      latestNonIdleTime = Date.now();
    };
    await new Promise(r => setTimeout(r, 100));
  };
};

const franky = async (msg: any) => {
  if (!msg.member?.voice.channel) {
    messageJoinFirst(msg);
    return;
  } else {
    if (msg?.guild?.voice?.cannel == undefined) {
      connection(msg);
    };
    const bonjour = await createAudioResource('bonjour.mp3');
    await player.play(bonjour);
    _connection.subscribe(player);
    while (player.state.status != AudioPlayerStatus.Idle) {
      await new Promise(r => setTimeout(r, 250));
    };
    await new Promise(r => setTimeout(r, 2000));
    const aurevoir = await createAudioResource('aurevoir.mp3');
    await player.play(aurevoir);
    while (player.state.status != AudioPlayerStatus.Idle) {
      await new Promise(r => setTimeout(r, 250));
    };
    disconnect();
  };
  return;
}

const play = async (msg: any) => {
  if (!msg.member?.voice.channel) {
    messageJoinFirst(msg);
    return;
  };
  if (msg.content.replace(/!play/g, "").trim().length == 0) {
    if (player.state.status === AudioPlayerStatus.Paused) {
      player.unpause();
      msg.react('▶️');
      return;
    } else {
      msg.reply("!help");
      return;
    };
  };
  if (msg?.guild?.voice?.channel == undefined) {
    connection(msg);
  };
  if (msg.content.indexOf("youtube.com") >= 0 || msg.content.indexOf("youtu.be") >= 0) {
    // Cas d'une recherche par URL
    const searched = await searchById(msg);
    const stream = await playYoutubeFromCommand(msg);
    const resource = await createAudioResource(stream.stream, {
      inputType: stream.type
    });
    player.play(resource);
    latestItem = searched.items[0];
    messagePlaying(msg, latestItem);
    _connection.subscribe(player);
  } else {
    // Cas d'une recherche par mot clé
    RESULTS = await getSearchResults(config.NUMBER_OF_RESULTS, msg);
    CURRENTLY_SEARCHING = true;
    messageSearch(RESULTS, config.NUMBER_OF_RESULTS, msg);
  };
  return;
};

const pause = (msg: any) => {
  if (!msg.member?.voice.channel) {
    messageJoinFirst(msg);
    return;
  } else if(player.state.status === AudioPlayerStatus.Playing || player.state.status === AudioPlayerStatus.Buffering) {
    player.pause();
    msg.react('⏸️');
  };
};

const playSelectedSound = async (msg: any) => {
  const index: number = parseInt(msg.content);
  if(CURRENTLY_SEARCHING &&  index >= 1 && index <= config.NUMBER_OF_RESULTS) {
    latestItem = RESULTS!.items[index-1];
    const stream = await playYoutubeFromURL(videoURL.concat(latestItem.id.videoId));
    const resource = await createAudioResource(stream.stream, { 
      inputType: stream.type
    });
    player.play(resource);
    messagePlaying(msg, latestItem);
    _connection.subscribe(player);
    RESULTS = undefined;
    CURRENTLY_SEARCHING = false;
  };
  return;
};

const skipSound = async (msg: any) => {
  const statusesAllowingSkip = [AudioPlayerStatus.AutoPaused, AudioPlayerStatus.Buffering, AudioPlayerStatus.Paused,AudioPlayerStatus.Playing];
  if (player && statusesAllowingSkip.includes(player.state.status) ) {
    messageSkipping(msg, latestItem);
    await player.stop(true);
  } else {
    messageNotSkipping(msg);
  };
};

const feur = async () => {
  latestNonIdleTime = Date.now();
  player.pause();
  const feurPlayer = createAudioPlayer();
  _connection.subscribe(feurPlayer);
  const feur = await createAudioResource("feur.mp3");
  await feurPlayer.play(feur);
  while (feurPlayer.state.status != AudioPlayerStatus.Idle) {
    await new Promise(r => setTimeout(r, 250));
  };
  _connection.subscribe(player);
  player.unpause();
};


export { client, connection, disconnect, franky, play, pause, joinServer, playSelectedSound, skipSound, feur };
