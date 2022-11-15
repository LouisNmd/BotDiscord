import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} from "@discordjs/voice";
import { Client, Intents, MessageEmbed } from "discord.js";
import {
  youtube,
  search,
  youtubeBySearch,
  searchById,
} from "@components/youtube";
import { messagePlaying, messageJoinFirst } from "@components/message";

let _connection: any;
const player = createAudioPlayer();

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
      const searched = await searchById(msg);
      const path = await youtube(msg);
      const resource = await createAudioResource(path[1].url);
      player.play(resource);
      messagePlaying(msg, searched); //send message
      const subscribe = _connection.subscribe(player);
    } else {
      const searched = await search(msg);
      const path = await youtubeBySearch(searched.items[0].id.videoId);
      const resource = await createAudioResource(path[1].url);
      player.play(resource);
      messagePlaying(msg, searched); //send message
      const subscribe = _connection.subscribe(player);
    }
  }
  return;
};

export { client, connection, disconnect, play, joinServer };
