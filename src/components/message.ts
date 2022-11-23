import { AudioPlayer } from "@discordjs/voice";
import { MessageEmbed } from "discord.js";
import { mapYoutubeSearchToResult } from "src/model/mapper";
import { Item, Root } from "src/model/youtube/searchData";

const messagePlaying = (msg: any, searched: Item) => {
  const user = msg.mentions.users.first() || msg.author;
  const embed = new MessageEmbed()
    .setTitle(`Playing : ${searched.snippet.title}`)
    .setAuthor(user.username, user.avatarURL())
    .setImage(searched.snippet.thumbnails.medium.url)
    .setURL(`https://www.youtube.com/watch?v=${searched.id.videoId}`)
    .setColor("RANDOM");
  msg.channel.send({ embeds: [embed] });
};

const messageSkipping = (msg: any, latestItem: Item) => {
  const embed = new MessageEmbed()
    .setTitle(`Skipping : ${latestItem.snippet.title}`)
    .setColor("RANDOM");
  msg.channel.send({ embeds: [embed] });
}

const messageNotSkipping = (msg: any) => {
  const embed = new MessageEmbed()
    .setTitle(`There's nothing to skip!`)
    .setColor("RANDOM");
  msg.channel.send({ embeds: [embed] });
}

const messageSearch = (results: Root, numberOfResults: number, msg: any) => {
  const user = msg.mentions.users.first() || msg.author;
  var body: string = "";
  results.items.forEach((item, index) => {
    const mappedItem = mapYoutubeSearchToResult(item);
    body += `${(index+1).toString()} : ${mappedItem.title}\n`;
  })
  var embed = new MessageEmbed()
    .setTitle(`Liste des ${numberOfResults} premiers résultats`)
    .setAuthor(user.username, user.avatarURL())
    .setDescription(body)
    .setColor("RANDOM");
  msg.channel.send({ embeds: [embed] });
}

const messageJoinFirst = (msg: any) => {
  const user = msg.mentions.users.first() || msg.author;
  const embed = new MessageEmbed()
    .setTitle("You should voice join channel first.")
    .setAuthor(user.username, user.avatarURL())
    .setColor("RANDOM");
  msg.reply({ embeds: [embed] });
};

const helpMePls = (msg:any) =>{
  const embed = new MessageEmbed()
    .setTitle("Command for use bot")
    .setAuthor('Songzy Bot','https://cdn.discordapp.com/app-icons/918046670216921120/dce904972f2d68139922c3e9d78f36c9.png?size=1024')
    .setDescription("!play <song name> or <URL>")
    .setColor("RANDOM");
  msg.reply({ embeds: [embed] });
}

export { messagePlaying, messageJoinFirst, helpMePls, messageSearch, messageSkipping, messageNotSkipping };
