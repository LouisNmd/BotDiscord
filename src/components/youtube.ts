import ytdl from "ytdl-core";
import axios from "./axios";
const baseURL = "https://youtube.googleapis.com/youtube/v3";

const youtube = async (msg: any) => {
  let link = msg.content.replace(/!play /g, "").trim();
  let info = await ytdl.getInfo(link);
  let format = ytdl.filterFormats(info.formats, "audioonly");
  return format;
};

const search = async (msg: any) => {
  let link = msg.content.replace("!play ", "").trim();
  const uri = `${baseURL}/search?part=snippet&q=${encodeURIComponent(
    link
  )}&key=${process.env.YOUTUBE_API}`;
  // console.log(uri);
  const data = await axios.get(uri);

  return data.data;
};

const searchById = async (msg: any) => {
  let link = msg.content.replace("!play ", "").trim();
  link = YouTubeGetID(link);
  // console.log(`link : ${link}`);
  const uri = `${baseURL}/videos?part=snippet&id=${link}&key=${process.env.YOUTUBE_API}`;
  // console.log(uri);
  const data = await axios.get(uri);

  return data.data;
};

const youtubeBySearch = async (data: string) => {
  let link = data.trim();
  let info = await ytdl.getInfo(link);
  let format = ytdl.filterFormats(info.formats, "audioonly");
  return format;
};

function YouTubeGetID(url: any) {
  var ID = "";
  url = url
    .replace(/(>|<)/gi, "")
    .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  if (url[2] !== undefined) {
    ID = url[2].split(/[^0-9a-z_\-]/i);
    ID = ID[0];
  } else {
    ID = url;
  }
  return ID;
}

export { youtube, search, youtubeBySearch, searchById };
