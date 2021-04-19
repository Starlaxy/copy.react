import React, { useState, useEffect } from 'react';

import PlayIcon from '../images/play_btn.png'
import StopIcon from '../images/stop_btn.png'

import classes from  '../css/VideoController.module.css'

export const VideoController = (props) => {
    
    const [intervalId, setIntarvalId] = useState(0);

    const [isMouseDown, setIsMouseDown] = useState(false);

    const style = {
        left: (props.mainVideoEle.currentTime / props.mainVideoEle.duration) * 100 + '%'
    }

    // frame上昇
    useEffect(() => {
        if(props.isPlay){
            var id = setInterval(() => {
                props.setCurrentFrame(props.mainVideoEle.currentTime * props.fps);
                return () => clearInterval(id);
            }, props.fps);
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
            props.pauseVideo();
        }
        else{
            props.playVideo();
        }
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

    /**
     *seekbarマウスダウン時currentFrame変更
     * @param {MouseEvent} e
     */
     const seekbarMouseDown = (e) => {
        setIsMouseDown(true);
        const frame = props.totalFrame / (e.target.clientWidth / e.nativeEvent.offsetX);
        props.changeCurrentFrame(frame);
        e.target.setPointerCapture(e.pointerId);
    }

    /**
     *seekbarマウスダウン後MouseMoveでcurrentFrame変更
     * @param {MouseEvent} e
     */
    const seekbarMouseMove = (e) => {
        const adjustmentWidth = Math.max(Math.min(e.target.clientWidth, e.nativeEvent.offsetX), 0);
        const frame = props.totalFrame / (e.target.clientWidth / adjustmentWidth);
        props.changeCurrentFrame(frame);
    }

    /**
     *マウスアップでMouseDown/MouseMoveイベント無効化
     */
    const seekbarMouseUp = (e) => {
        setIsMouseDown(false);
        e.target.releasePointerCapture(e.pointerId);
    }

    return(
        <div className={classes.controller}>
            <img src={props.isPlay ? StopIcon : PlayIcon} alt='再生アイコン' onClick={() => switchPlay()} className={classes.playIcon} />
            <div 
                onPointerDown={(e) => seekbarMouseDown(e)}
                onPointerMove={(isMouseDown) ? (e) => seekbarMouseMove(e) : undefined}
                onPointerUp={(isMouseDown) ? (e) => seekbarMouseUp(e) : undefined}
                className={classes.seekbar}>
                <div className={classes.seekbarTotal}></div>
                <div className={classes.seekbarNow} style={style} ></div>
            </div>
            <div className={classes.time}>
                <div className={classes.currrentTime}>{secondsToTime(props.mainVideoEle.currentTime)}</div>
                <div>/</div>
                <div className={classes.duration}>{secondsToTime(props.mainVideoEle.duration)}</div>
            </div>
        </div>
    )
}