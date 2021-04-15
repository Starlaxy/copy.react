import React, { Fragment, useState, useRef } from 'react';
import { createVideoRelation } from '../api/video';
import { Transition } from 'react-transition-group';

import classes from  '../css/VideoRelationForm.module.css'

export const VideoRelationForm = (props) => {

    const nodeRef = useRef();
    
    const initialVideoState = {
        'video': '',
        'three_dimensional_flg': false,
    }

    const [title, setTitle] = useState("");
    const [video, setVideo] = useState([initialVideoState]);

    const videoInput = useRef();

    // サイドメニューアニメーション
    const [mount, setMount] = useState(false);
    const transitionStyle = {
        entering: {
            transition: 'all 0.5s ease',
            transform: 'translateX(-400px) ',
        },
        entered: {
            transition: 'all 0.5s ease',
            transform: 'translateX(-400px) ',
        },
        exiting: {
            transition: 'all 0.5s ease',
            transform: 'translateX(0)',
        },
        exited: {
            transition: 'all 0.5s ease',
            transform: 'translateX(0)',
        },
    };

    const handleDisplay = (e) => {
        e.preventDefault();
        setMount(!mount);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('project', props.projectId);
        video.forEach(v => {
            formData.append('video', v.video, v.video.name)
            formData.append('three_dimensional_flg', v.three_dimensional_flg)
        });

        createVideoRelation(formData)
        .then(vr => {
            const newVideoRelation = [...props.videoRelation, vr]
            props.setVideoRelation(newVideoRelation);
            setTitle("");
            setVideo([initialVideoState]);
            videoInput.current.value = '';
        })
        .catch(e => {
            throw new Error(e);
        });
    }

    const AddForm = (e) => {
        e.preventDefault();
        setVideo([...video, initialVideoState]);
    }

    const handleChange = (target, e) => {
        var newVideo = [...video];
        if(e.target.name === 'video'){
            newVideo.find(v => v===target).video = e.target.files[0];
        }
        else if(e.target.name === 'three_dimensional_flg'){
            newVideo.find(v => v===target).three_dimensional_flg = e.target.checked;
        }
        setVideo(newVideo);
    }

    return(
        <Transition nodeRef={nodeRef} in={mount} timeout={1000} >
            {(state) =>
                <div ref={nodeRef}>
                    <button className={classes.displayFormBtn} onClick={ (e) => handleDisplay(e) } style={transitionStyle[state]}>{ mount ? '閉じる' : '追加' }</button>
                    <form className={classes.addForm} style={transitionStyle[state]}>
                        <label>
                            タイトル:
                            <input type="text" name="title" value={ title } onChange={ (e) => setTitle(e.target.value) } />
                        </label>
                        {video.map((v, index) => (
                            <Fragment key={index}>
                                <label>
                                    動画:
                                    <input type="file" name="video" accept='video/*' alt="動画" onChange={ (e) => handleChange(v, e) } ref={videoInput} />
                                </label>
                                <label>
                                    360度動画:
                                    <input type="checkbox" name="three_dimensional_flg" onChange={ (e) => handleChange(v, e) } checked={v.three_dimensional_flg} />
                                </label>
                            </Fragment>
                        ))}
                        <button onClick={ (e) => AddForm(e) }>追加</button>
                        <button onClick={ handleSubmit }>送信</button>
                    </form>
                </div>
            }
        </Transition>
    )
}