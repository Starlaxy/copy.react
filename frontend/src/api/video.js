import config from "../components/Environment"

const API_VIDEORELATION_ROOT = config.API_SERVER + config.API_VIDEORELATION_NAME
const API_VIDEO_ROOT = config.API_SERVER + config.API_VIDEO_NAME

const toJson = async (res) => {
    const json = await res.json();
    if(res.ok){
        return json;
    }else{
        throw new Error(json.message);
    }
}

// ビデオ取得
export const getVideo = async (videoRelationId) => {
    const res = await fetch(API_VIDEO_ROOT + videoRelationId + config.API_VIDEO_ACTION.GET_FROM_VIDEORELATION, {
        method: 'GET',
    })
    return await toJson(res);
}

// storyVideo一覧取得
export const getStoryVideo = async (videoRelationId) => {
    const res = await fetch(API_VIDEORELATION_ROOT + videoRelationId + config.API_VIDEO_ACTION.GET_STORY_VIDEO, {
        method: 'GET',
    })
    return await toJson(res);
}