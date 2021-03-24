import config from "../../components/Environment"

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

// ビデオ一覧取得
export const getVideoRelation = async (projectId) =>{
    const res = await fetch(API_VIDEORELATION_ROOT + projectId + config.API_VIDEORELATION_ACTION.GET_FROM_PROJECT, {
        method: 'GET',
    })
    return await toJson(res);
}

// 登録
export const createVideoRelation = async (data) =>{
    const res = await fetch(API_VIDEORELATION_ROOT, {
        method: 'POST',
        body: data,
    });
    return await toJson(res);
}

// ビデオ取得
export const getVideo = async (videoRelationId) =>{
    const res = await fetch(API_VIDEO_ROOT + videoRelationId + config.API_VIDEO_ACTION.GET_FROM_VIDEORELATION, {
        method: 'GET',
    })
    return await toJson(res);
}