import React from 'react';

import CloseIcon from '../../images/video/close-icon.png'

import classes from  '../css/StoryLayer.module.css'

export const StoryLayer = (props) => {

    const storyVideo = props.storyVideo.find(sv => sv.id === props.story_next_video)
    console.log(storyVideo)

    /**
     *Layer閉じるボタン押下イベント
     */
    const closeLayer = () => {
        props.setIsDisplayStoryLayer(false);
    }

    return (
        <div className={classes.storyLayer}>
            <div>
                <p>{storyVideo.title}に遷移するイベント</p>
                <p>開始フレーム：{props.story_start_frame}</p>
            </div>
            <img src={CloseIcon} alt='閉じるボタン' className={classes.closeIcon} onClick={() => closeLayer()} />
        </div>
    )
}