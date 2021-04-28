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

    const [title, setTitle] = useState('');
    const [titleError, setTitleError] = useState('');
    const [video, setVideo] = useState([initialVideoState]);
    const [videoErrors, setVideoErrors] = useState(['']);

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
        // else内で記載するとsetVideoErrorsで即時反映されないため、外で定義
        const newErrors = [...videoErrors];
        video.forEach((v, index) => {
            if(v.video){
                formData.append('video', v.video, v.video.name);
                formData.append('three_dimensional_flg', v.three_dimensional_flg);
            }
            else {
                newErrors[index] = '必須項目です';
                setVideoErrors(newErrors);
            }
        });

        if((title !== '') && newErrors.every(e => e === '')){
            props.setLoading(true);
            createVideoRelation(formData)
            .then(vr => {
                const newVideoRelation = [...props.videoRelation, vr]
                props.setVideoRelation(newVideoRelation);
                setTitle('');
                setVideo([initialVideoState]);
                props.setLoading(false);
            })
            .catch(e => {
                throw new Error(e);
            });
        }
        else {
            setTitleError(titleValidation(title));
        }
    }

    const AddForm = (e) => {
        e.preventDefault();
        setVideo([...video, initialVideoState]);
        videoErrors.push('');
    }

    const handleChange = (target, e) => {
        let newVideo = [...video];
        if(e.target.name === 'video'){
            newVideo.find(v => v===target).video = e.target.files[0];
            const newErrors = [...videoErrors];
            newErrors[e.target.id] = '';
            setVideoErrors(newErrors);
        }
        else if(e.target.name === 'three_dimensional_flg'){
            newVideo.find(v => v===target).three_dimensional_flg = e.target.checked;
        }
        setVideo(newVideo);
    }

    /**
     *動画が2つ以上の際にDeleteボタン描画
     * @param {number} index
     * @return {JSX} Deleteボタン 
     */
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
        videoErrors.splice(index, 1);

        setVideo(videos);
    }

    /**
     *Blur時入力チェック
     * @param {*} e
     */
    const handleBlur = (e) => {
        setTitleError(titleValidation(e.target.value))
    }

    /**
     *タイトル入力チェック
     * @param {string} title
     * @return {string} ErrorMessage 
     */
    const titleValidation = (title) => {
        if(!title){
            return '入力必須項目です';
        }
        else if(100 < title.length){
            return '100文字以下で入力してください'
        }
        return '';
    }

    /**
     *エラーがあればエラーメッセージ表示
     * @param {string} message エラーメッセージ
     * @return {JSX} span
     */
    const renderErrorMessage = (message) => {
        if(message){
            return <span className={classes.errorMessage}>{message}</span>
        }
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
                            <label className={classes.inputLabel}>タイトル</label>
                            {renderErrorMessage(titleError)}
                            <input
                                className={`${classes.inputText} ${(titleError) ? classes.error : ''}`}
                                type='text'
                                name='title'
                                value={ title }
                                onChange={ (e) => setTitle(e.target.value) }
                                onBlur={(e) => handleBlur(e)} />
                        </div>
                        {video.map((v, index) => (
                            <Fragment key={index}>
                                <div className={classes.inputCol}>
                                    <label className={classes.inputLabel}>動画</label>
                                    {renderErrorMessage(videoErrors[index])}
                                    <input
                                        id={index}
                                        className={classes.inputVideo}
                                        type='file'
                                        name='video'
                                        accept='video/*'
                                        alt='動画'
                                        onChange={ (e) => handleChange(v, e) }
                                        ref={videoInput} />
                                </div>
                                <div className={classes.inputCheck}>
                                    <label className={classes.inputLabel}>360度動画</label>
                                    <input type='checkbox' name='three_dimensional_flg' onChange={ (e) => handleChange(v, e) } checked={v.three_dimensional_flg} />
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