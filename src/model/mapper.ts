import { Result } from "./result";
import { Item } from "./youtube/searchData";

export function mapYoutubeSearchToResult(input: Item): Result {
    var output: Result = {
        id: input.id.videoId,
        title: input.snippet.title,
    };
    return output;
};
