export enum ErrorCode {
    //common
    NotFound = "0000",
    IllegalArgument = "0002",
    FileMimeTypeNotAcceptable = "0003",
    FileDownloadError = "0004",


    //user
    AlreadyFollowing = "1005",

    //feed
    RequireImage = "2000",
    AlreadyLikedFeed = "2001",
    SubCommentAddition = "2002",


    //error
    Unknown = "9999",
}
