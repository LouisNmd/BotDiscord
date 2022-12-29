import { baseURL, searchByKeyWord } from "src/const/youtube-api-uri";
import { Root } from "src/model/youtube/searchData";
import playdl from "play-dl";
import axios from "axios";

const playYoutubeFromCommand = async (msg: any) => {
  let link = msg.content.replace(/!play /g, "").trim();
  return playYoutubeFromURL(link);
};

const playYoutubeFromURL = async (link: any) => {
  let stream = await playdl.stream(link);
  return stream;
};

const getSearchResults = async (numberOfResults: number, msg: any): Promise<Root> => {
  let keyword = msg.content.replace("!play ", "").trim();
  const uri = searchByKeyWord(numberOfResults, keyword);
  const data = await axios.get(uri);
  return data.data;
};

const searchById = async (msg: any) => {
  let link = msg.content.replace("!play ", "").trim();
  link = YouTubeGetID(link);
  const uri = `${baseURL}/videos?part=snippet&id=${link}&key=${process.env.YOUTUBE_API}`;
  const data = await axios.get(uri);
  return data.data;
};

const youtubeBySearch = async (data: string) => {
  let link = data.trim();
  let info = await playdl.search(link);
  return info;
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
};

export { playYoutubeFromURL, playYoutubeFromCommand, getSearchResults, youtubeBySearch, searchById };
