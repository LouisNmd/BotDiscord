import { EmbedBuilder } from "discord.js";
import { mapYoutubeSearchToResult } from "src/model/mapper";
import { Item, Root } from "src/model/youtube/searchData";

const messagePlaying = (msg: any, searched: Item) => {
  const user = msg.mentions.users.first() || msg.author;
  const embed = new EmbedBuilder()
    .setTitle(`Playing : ${searched.snippet.title}`)
    .setAuthor( { name: user.username, iconURL: user.avatarURL() } )
    .setImage(searched.snippet.thumbnails.medium.url)
    .setURL(`https://www.youtube.com/watch?v=${searched.id.videoId}`)
    .setColor("Random");
  msg.channel.send({ embeds: [embed] });
};

const messageSkipping = (msg: any, latestItem: Item) => {
  const embed = new EmbedBuilder()
    .setTitle(`Skipping : ${latestItem.snippet.title}`)
    .setColor("Random");
  msg.channel.send({ embeds: [embed] });
};

const messageNotSkipping = (msg: any) => {
  const embed = new EmbedBuilder()
    .setTitle(`There's nothing to skip!`)
    .setColor("Random");
  msg.channel.send({ embeds: [embed] });
};

const messageSearch = (results: Root, numberOfResults: number, msg: any) => {
  const user = msg.mentions.users.first() || msg.author;
  var body: string = "";
  results.items.forEach((item, index) => {
    const mappedItem = mapYoutubeSearchToResult(item);
    body += `${(index+1).toString()} : ${mappedItem.title}\n`;
  });
  var embed = new EmbedBuilder()
    .setTitle(`Liste des ${numberOfResults} premiers résultats`)
    .setAuthor({ name: user.username, iconURL: user.avatarURL() })
    .setDescription(body)
    .setColor("Random");
  msg.channel.send({ embeds: [embed] });
};

const messageJoinFirst = (msg: any) => {
  const user = msg.mentions.users.first() || msg.author;
  const embed = new EmbedBuilder()
    .setTitle("You should voice join channel first.")
    .setAuthor({ name: user.username, iconURL: user.avatarURL() })
    .setColor("Random");
  msg.reply({ embeds: [embed] });
};

const helpMePls = (msg:any) =>{
  const embed = new EmbedBuilder()
    .setTitle("Command for use bot")
    .setAuthor({ name: 'Songzy Bot', iconURL: 'https://cdn.discordapp.com/app-icons/918046670216921120/dce904972f2d68139922c3e9d78f36c9.png?size=1024' })
    .setDescription("!play <song name> or <URL>")
    .setColor("Random");
  msg.reply({ embeds: [embed] });
};

export { messagePlaying, messageJoinFirst, helpMePls, messageSearch, messageSkipping, messageNotSkipping };
