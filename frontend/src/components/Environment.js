export default {
    // バックエンドURL
    API_SERVER: 'http://localhost:8000/',

    // VideoRelation
    API_VIDEORELATION_NAME: "videorelation/",
    API_VIDEORELATION_ACTION: {
        GET_FROM_PROJECT: "/get_from_project/",
    },

    // Video
    API_VIDEO_NAME: 'video/',
    API_VIDEO_ACTION: {
        GET_FROM_VIDEORELATION: '/get_from_videorelation/',
        GET_STORY_VIDEO: '/get_story_video/',
        GET_RELATED_VIDEO: '/get_related_video/',
    },

    // Tag
    API_TAG_NAME: 'tag/',
}