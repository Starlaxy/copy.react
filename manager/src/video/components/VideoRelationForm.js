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
        let newVideo = [...video];
        if(e.target.name === 'video'){
            newVideo.find(v => v===target).video = e.target.files[0];
        }
        else if(e.target.name === 'three_dimensional_flg'){
            newVideo.find(v => v===target).three_dimensional_flg = e.target.checked;
        }
        setVideo(newVideo);
    }

    const renderDeletebtn = (index) => {
        if(1 < video.length){
            return (
                <div key={index}>
                    <button key={index} onClick={(e) => handleDelete(e, index)} className={classes.deleteBtn}>削除</button>
                </div>
            )
        }
    }

    /**
     *追加した動画削除
     * @param {*} index
     */
    const handleDelete = (e, index) => {
        e.preventDefault();
        let videos = [...video];
        videos.splice(index, 1);

        setVideo(videos);
    }

    return(
        <Transition nodeRef={nodeRef} in={mount} timeout={1000} >
            {(state) =>
                <div ref={nodeRef}>
                    <div className={classes.displayFormBtnWrap} onClick={ (e) => handleDisplay(e) } style={transitionStyle[state]}>
                        <p className={classes.displayFormBtn}>{ mount ? '閉じる' : '追加' }</p>
                    </div>
                    <form className={classes.addForm} style={transitionStyle[state]}>
                        <div className={classes.inputCol}>
                            <label>タイトル</label>
                            <input className={classes.inputText} type="text" name="title" value={ title } onChange={ (e) => setTitle(e.target.value) } />
                        </div>
                        {video.map((v, index) => (
                            <Fragment key={index}>
                                <div className={classes.inputCol}>
                                    <label>動画</label>
                                    <input type="file" name="video" accept='video/*' alt="動画" onChange={ (e) => handleChange(v, e) } ref={videoInput} />
                                </div>
                                <div className={classes.inputCheck}>
                                    <label>360度動画</label>
                                    <input type="checkbox" name="three_dimensional_flg" onChange={ (e) => handleChange(v, e) } checked={v.three_dimensional_flg} />
                                </div>
                                {renderDeletebtn(index)}
                            </Fragment>
                        ))}
                        <div className={classes.addBtnWrap}>
                            <button onClick={(e) => AddForm(e)} className={classes.addBtn}>動画追加</button>
                        </div>
                        <div className={classes.submitBtnWrap}>
                            <button onClick={handleSubmit} className={classes.submitBtn}>送信</button>
                        </div>
                    </form>
                </div>
            }
        </Transition>
    )
}