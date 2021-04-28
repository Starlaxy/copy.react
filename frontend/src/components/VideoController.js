import React, { useState, useEffect } from 'react';

import PlayIcon from '../images/play_btn.png'
import StopIcon from '../images/stop_btn.png'

import VolumeOff from '../images/volume_off.png'
import VolumeSmall from '../images/volume_small.png'
import VolumeMiddle from '../images/volume_middle.png'
import VolumeLarge from '../images/volume_large.png'

import FullScreen from '../images/fullscreen.png'
import ExitFullScreen from '../images/exit_fullscreen.png'

import classes from  '../css/VideoController.module.css'

export const VideoController = (props) => {
    
    const [intervalId, setIntarvalId] = useState(0);

    const [isSeekbarPointerDown, setIsSeekbarPointerDown] = useState(false);
    const [isVolumebarPointerDown, setIsVolumebarPointerDown] = useState(false);

    const [volume, setVolume] = useState(100);
    const [isMuted, setIsMuted] = useState(false);

    const seekBarNowStyle = {
        left: (props.mainVideoEle.currentTime / props.mainVideoEle.duration) * 100 + '%'
    }

    const volumeBarNowStyle = {
        left: `calc(${volume}% - 4px)`
    }

    // frame上昇
    useEffect(() => {
        if(props.isPlay){
            let id = setInterval(() => {
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
    const switchPlay = (e) => {
        e.stopPropagation();
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
        let minute = Math.floor(time / 60 | 0);
        let seconds = Math.floor(time % 60);
        return ("0" + minute).slice(-2) + ":" + ("0" + seconds).slice(-2);
    }

    /**
     *seekbarマウスダウン時currentFrame変更
     * @param {PointerEvent} e
     */
     const seekbarPointerDown = (e) => {
        e.stopPropagation();
        setIsSeekbarPointerDown(true);
        const frame = props.totalFrame / (e.target.clientWidth / e.nativeEvent.offsetX);
        props.changeCurrentFrame(frame);
        e.target.setPointerCapture(e.pointerId);
    }

    /**
     *seekbarマウスダウン後PointerMoveでcurrentFrame変更
     * @param {PointerEvent} e
     */
    const seekbarPointerMove = (e) => {
        e.stopPropagation();
        const adjustmentWidth = Math.max(Math.min(e.target.clientWidth, e.nativeEvent.offsetX), 0);
        const frame = props.totalFrame / (e.target.clientWidth / adjustmentWidth);
        props.changeCurrentFrame(frame);
    }

    /**
     *マウスアップでPointerDown/PointerMoveイベント無効化
     */
    const seekbarPointerUp = (e) => {
        e.stopPropagation();
        setIsSeekbarPointerDown(false);
        e.target.releasePointerCapture(e.pointerId);
    }

    /**
     *VolumeBarPointerDown時ボリューム変更
     * @param {PointerEvent} e
     */
    const volumeIconClick = (e) => {
        e.stopPropagation();
        setIsMuted(!props.mainVideoEle.muted);
        props.mainVideoEle.muted = (!props.mainVideoEle.muted);
    }

    /**
     *VolumeBarPointerDown時ボリューム変更
     * @param {PointerEvent} e
     */
    const volumebarPointerDown = (e) => {
        e.stopPropagation();
        setIsVolumebarPointerDown(true);
        setVolume(e.nativeEvent.offsetX);
        props.mainVideoEle.volume = e.nativeEvent.offsetX / 100;
        e.target.setPointerCapture(e.pointerId);
    }

    /**
     *Volume変更
     * @param {PointerEvent} e
     */
    const volumebarPointerMove = (e) => {
        setVolume(Math.max(0, Math.min(100, e.nativeEvent.offsetX)));
        props.mainVideoEle.volume = Math.max(0, Math.min(100, e.nativeEvent.offsetX)) / 100;
    }

    /**
     *PointerDownフラグOFFにし、caputure解放
     * @param {PointerEvent} e
     */
    const volumebarPointerUp = (e) => {
        setIsVolumebarPointerDown(false);
        e.target.releasePointerCapture(e.pointerId);
    }

    /**
     *Volumeの画像をVolumeの値に応じて描画
     * @return {JSX} VolumeImg 
     */
    const renderVolumeImg = () => {
        let src;
        if((volume === 0) || (isMuted)){
            src = VolumeOff;
        }
        else if(volume <= 20){
            src = VolumeSmall;

        }
        else if(volume <= 70){
            src = VolumeMiddle;
        }
        else {
            src = VolumeLarge;
        }
        return (
            <img src={src} className={classes.volumeImg} alt='ボリュームイメージ' onClick={(e) => volumeIconClick(e)} />
        )
    }

    /**
     *FullScreenImg切り替え
     * @return {JSX} img
     */
    const renderFullScreenImg = () => {
        const src = (props.isFullScreen) ? ExitFullScreen : FullScreen
        return (
            <img src={src} onClick={(e) => props.handleFullScreen(e)} alt='フルスクリーンアイコン' className={classes.fullScreenImg} />
        )
    }

    return(
        <div className={classes.controller} >
            <div className={classes.timeContloller}>
                <div className={classes.time}>
                    <div className={classes.currrentTime}>{secondsToTime(props.mainVideoEle.currentTime)}</div>
                    <div>/</div>
                    <div className={classes.duration}>{secondsToTime(props.mainVideoEle.duration)}</div>
                </div>
                <div 
                    onPointerDown={(e) => seekbarPointerDown(e)}
                    onPointerMove={(isSeekbarPointerDown) ? (e) => seekbarPointerMove(e) : undefined}
                    onPointerUp={(isSeekbarPointerDown) ? (e) => seekbarPointerUp(e) : undefined}
                    className={classes.seekbar}>
                    <div className={classes.seekbarTotal}></div>
                    <div className={classes.seekbarNow} style={seekBarNowStyle} ></div>
                </div>
            </div>
            <div className={classes.optionController}>
                <img src={props.isPlay ? StopIcon : PlayIcon} alt='再生アイコン' onClick={(e) => switchPlay(e)} className={classes.playIcon} />
                <div className={classes.volumeController} >
                    {renderVolumeImg()}
                    <div
                        className={classes.volumeBar}
                        onPointerDown={(e) => volumebarPointerDown(e)}
                        onPointerMove={(isVolumebarPointerDown) ? (e) => volumebarPointerMove(e) : undefined}
                        onPointerUp={(isVolumebarPointerDown) ? (e) => volumebarPointerUp(e) : undefined} >
                        <div className={classes.volumeTotal}></div>
                        <div className={classes.volumeNow} style={volumeBarNowStyle}></div>
                    </div>
                </div>
                {renderFullScreenImg()}
            </div>
        </div>
    )
}