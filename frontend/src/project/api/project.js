const toJson = async (res) => {
    const json = await res.json();
    if(res.ok){
        return json;
    }else{
        throw new Error(json.message);
    }
}

//プロジェクト一覧取得
export const getProject = async () =>{
    const res = await fetch('http://localhost:8000/project/get_all/', {
        method: 'GET',
    })
    return await toJson(res);
}

//登録
export const createProject = async (data) =>{
    const res = await fetch('http://localhost:8000/project/create/', {
        headers:{
            'Accept': 'application/json, */*',
            'Content-type':'application/json'    
        },
        method: 'POST',
        body: JSON.stringify(data),
    })
    return await toJson(res);
}