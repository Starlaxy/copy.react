export default {
    // バックエンドURL
    API_SERVER: "http://localhost:8000/",

    // 各ルート
    // Project
    API_PROJECT_NAME: "project/",
    API_PROJECT_ACTION: {
        UPDATE_TITLE: "/update_title/",
        UPDATE_DESCRIPTION: "/update_description/",
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
        GET_STORY_VIDEO: "/get_story_video/",
    },

    // Tag
    API_TAG_NAME: "tag/",
}