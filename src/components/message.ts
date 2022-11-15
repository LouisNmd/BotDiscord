import { MessageEmbed } from "discord.js";

const messagePlaying = (msg: any, searched: any) => {
  const user = msg.mentions.users.first() || msg.author;
  const embed = new MessageEmbed()
    .setTitle(`Playing : ${searched.items[0].snippet.title}`)
    .setAuthor(user.username, user.avatarURL())
    .setImage(searched.items[0].snippet.thumbnails.medium.url)
    .setURL(`https://www.youtube.com/watch?v=${searched.items[0].id.videoId}`)
    .setColor("RANDOM");
  msg.reply({ embeds: [embed] });
};

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

export { messagePlaying,messageJoinFirst,helpMePls };
