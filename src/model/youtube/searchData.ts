export interface Root {
    etag: string
    items: Item[]
    kind: string
    nextPageToken: string
    pageInfo: PageInfo
    regionCode: string
  }
  
  export interface Item {
    etag: string
    id: Id
    kind: string
    snippet: Snippet
  }
  
  export interface Id {
    kind: string
    videoId: string
  }
  
  export interface Snippet {
    channelId: string
    channelTitle: string
    description: string
    liveBroadcastContent: string
    publishedAt: string
    publishTime: string
    thumbnails: Thumbnails
    title: string
  }
  
  export interface Thumbnails {
    default: Default
    high: High
    medium: Medium
  }
  
  export interface Default {
    height: number
    url: string
    width: number
  }
  
  export interface High {
    height: number
    url: string
    width: number
  }
  
  export interface Medium {
    height: number
    url: string
    width: number
  }
  
  export interface PageInfo {
    resultsPerPage: number
    totalResults: number
  }
  