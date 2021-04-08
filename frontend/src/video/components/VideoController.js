import React, { useState, useEffect } from 'react';

import PlayIcon from '../../images/video/play_btn.png'
import StopIcon from '../../images/video/stop_btn.png'

import classes from  '../css/VideoController.module.css'

export const VideoController = (props) => {
    
    const totalFrame = (props.mainVideo.duration * 30) | 0;
    const [intervalId, setIntarvalId] = useState(0);
    const fps = 30;

    const style = {
        left: (props.mainVideo.currentTime / props.mainVideo.duration) * 100 + '%'
    }

    // frame上昇
    useEffect(() => {
        if(props.isPlay){
            var id = setInterval(() => {
                props.setCurrentFrame(props.mainVideo.currentTime * fps);
                return () => clearInterval(id);
            }, fps);
            setIntarvalId(id);
        }
        else{
            clearInterval(intervalId);
        }
    }, [props.isPlay]);

    /**
     *再生/停止ボタン押下イベント
     */
    const switchPlay = () => {
        if(props.isPlay){
            props.player.map(p => p.pause());
        }
        else{
            props.player.map(p => p.play());
        }
        props.setIsPlay(!props.isPlay);
    }

    /**
     *秒数をMM:ss表記にフォーマット
     * @param {number} time
     * @return {string} 分:秒    
     */
    const secondsToTime = (time) => {
        var minute = Math.floor(time / 60 | 0);
        var seconds = Math.floor(time % 60);
        return ("0" + minute).slice(-2) + ":" + ("0" + seconds).slice(-2);
    }

    return(
        <div className={classes.controller}>
            <img src={props.isPlay ? StopIcon : PlayIcon} alt='再生アイコン' onClick={() => switchPlay()} className={classes.playIcon} />
            <div className={classes.seekbar}>
                <div className={classes.seekbarTotal}></div>
                <div className={classes.seekbarNow} style={style} ></div>
            </div>
            <div className={classes.time}>
                <div className={classes.currrentTime}>{secondsToTime(props.mainVideo.currentTime)}</div>
                <div>/</div>
                <div className={classes.duration}>{secondsToTime(props.mainVideo.duration)}</div>
            </div>
            <div className={classes.frame}>
                <div className={classes.currentFrame}>{Math.ceil(props.currentFrame)}</div>
                <div>/</div>
                <div className={classes.totalFrame}>{totalFrame}</div>
            </div>
        </div>
    )
}