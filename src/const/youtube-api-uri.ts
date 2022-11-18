const baseURL = "https://youtube.googleapis.com/youtube/v3";
const videoURL = "https://www.youtube.com/watch?v=";

function searchByKeyWord(length: number, keyword: string): string {
    return `${baseURL}/search?part=snippet&maxResults=${length}&q=${keyword}&key=${process.env.YOUTUBE_API}`;
}

export { baseURL, videoURL, searchByKeyWord }