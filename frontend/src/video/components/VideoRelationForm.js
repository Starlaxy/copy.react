import React, { useState, setState } from 'react';
import { createVideoRelation } from '../api/video'
// import CSRFToken from '../../components/csrftoken';

export const VideoRelationForm = (prop) => {
    
    const [title, setTitle] = useState("");
    const [video, setVideo] = useState(null);
    const [threeDimensionalFlg, setThreeDimensionalFlg] = useState(false);

    const handleSubmit = (e) => {
        // event.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('project', prop.projectId);
        formData.append('video', video, video.name);
        formData.append('three_dimensional_flg', threeDimensionalFlg);

        console.log(typeof formData)

        createVideoRelation(formData)
            .then(vr => {
                console.log('hogehoge');
            })
            .catch(e => {
                throw new Error(e);
            });
    }

    return(
        <form>
            <label>
                タイトル:
                <input type="text" name="title" value={ title } onChange={ (e) => setTitle(e.target.value) } />
            </label>
            <label>
                動画:
                <input type="file" name="video" accept='video/*' alt="動画" onChange={ (e) => setVideo(e.target.files[0]) } />
            </label>
            <label>
                動画タイプ:
                <input type="checkbox" name="three_dimensional_flg" onChange={ (e) => setThreeDimensionalFlg(e.target.checked) } />
            </label>
            <button onClick={ handleSubmit }>送信</button>
        </form>
    )
}