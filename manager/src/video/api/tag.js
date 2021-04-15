import config from "../../common/components/Environment"

const API_TAG_ROOT = config.API_SERVER + config.API_TAG_NAME

const toJson = async (res) => {
    const json = await res.json();
    if(res.ok){
        return json;
    }else{
        throw new Error(json.message);
    }
}

// タグ登録
export const createTag = async (data) => {
    const res = await fetch(API_TAG_ROOT, {
        method: 'POST',
        body: data,
    })
    return await toJson(res);
}

// タグ登録
export const changeTag = async (tagId, data) => {
    const res = await fetch(API_TAG_ROOT + tagId + '/', {
        method: 'PUT',
        body: data,
    })
    return await toJson(res);
}

// 削除
export const deleteTag = async (tagId) => {
    const res = await fetch(API_TAG_ROOT + tagId + '/', {
        method: 'DELETE',
    });
    return await res;
}