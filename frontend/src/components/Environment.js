export default {
    // バックエンドURL
    API_SERVER: "http://localhost:8000/",

    // 各ルート
    // Project
    API_PROJECT_NAME: "project/",
    API_PROJECT_ACTION: {
        // GET_FROM_PROJECT: "/get_from_project/",
    },

    // VideoRelation
    API_VIDEORELATION_NAME: "videorelation/",
    API_VIDEORELATION_ACTION: {
        GET_FROM_PROJECT: "/get_from_project/",
    },

    // Video
    API_VIDEO_NAME: "video/",
    API_VIDEO_ACTION: {
        GET_FROM_VIDEORELATION: "/get_from_videorelation/",
    },
}