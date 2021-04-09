import React, { useEffect, useState } from 'react';
import { VideoPlayer } from './VideoPlayer'
import { TagElement } from './TagElement'
import { VideoController } from './VideoController'

import CloseIcon from '../../images/video/close-icon.png'
import { initialPopupState } from "./InitialState"

import classes from  '../css/VideoContent.module.css'

export const VideoContent = (props) => {

    // 描画されたVideoタグ格納場所(Video.playなどVideoを操作する用)
    const [player, setPlayer] = useState([]);
    const [mainVideo, setMainVideo] = useState(<video></video>);
    const [isPlay, setIsPlay] = useState(false);

    const [popupInfo, setPopupInfo] = useState(initialPopupState);
    const [isDisplayPopup, setIsDisplayPopup] = useState(false);

    const mainVideoStyle = {
        width: '100%'
    }

    const [currentFrame, setCurrentFrame] = useState(0);
    const [intervalId, setIntarvalId] = useState(0);
    const fps = 30;

    // frame上昇
    useEffect(() => {
        if(isPlay){
            var id = setInterval(() => {
                setCurrentFrame(mainVideo.currentTime * fps);
                return () => clearInterval(id);
            }, fps);
            setIntarvalId(id);
        }
        else{
            clearInterval(intervalId);
        }
    }, [isPlay]);

    const renderVideo = () => {
        const [first, ...rest] = video;
        return (
            <>
                {first &&
                    <VideoPlayer
                        key={first.id}
                        {...first}
                        style={mainVideoStyle}
                        player={player}
                        loadedMetadata={loadedMetadata}
                        onEnded={onEnded}
                        changeVideo={undefined}
                        isCreatingTag={props.isCreatingTag}
                        createTagMouseDown={(props.isCreatingTag) ? props.createTagMouseDown : undefined}
                        createTagMouseMove={(props.isMouseDown) ? props.createTagMouseMove : undefined}
                        createTagMouseUp={(props.isMouseDown) ? props.createTagMouseUp : undefined} />
                }
                <div className={classes.subVideoWrap}>
                    {rest.map(v => 
                        <VideoPlayer
                            key={v.id}
                            {...v}
                            style={mainVideoStyle}
                            player={player}
                            loadedMetadata={undefined}
                            onEnded={undefined}
                            changeVideo={changeVideo} />
                    )}
                </div>
            </>
        )
    };

    const renderTag = () => {
        const [first] = video;
        const displayTag = [];
        first.tags.map(t => {
            if((t.display_frame < currentFrame) && (currentFrame < t.hide_frame)){
                displayTag.push(t);
            }
        });
        return displayTag.map(t =>
            <TagElement key={t.id} {...t} displayPopup={displayPopup} />
        );
    }

    const switchPlay = () => {
        if(isPlay){
            player.map(p => p.pause());
        }
        else{
            player.map(p => p.play());
        }
        setIsPlay(!isPlay);
    }

    /**
     *ビデオ読み込み後Durationセット（MAINVIDEOのみ）
     *
     * @param {videoElement}
     */
    const loadedMetadata = (target) => {
        setMainVideo(target);
    }

    /**
     *動画終了時イベント
     */
    const onEnded = () => {
        setIsPlay(false);
    }

    /**
     *サブ動画クリックイベント
     *
     * @param {VideoElement}
     */
    const changeVideo = (targetEle) => {
        const newVideo = [...video];

        const target = newVideo.find(nv => String(nv.id) === targetEle.id);
        newVideo.forEach((nv, index) => {
            if(nv => String(nv.id) === target.id){
                console.log(index)
                newVideo[index] = newVideo.find(nv => String(nv.id) === mainVideo.id);
            }
        });
        newVideo[0] = target;
        setVideo(newVideo);
        setMainVideo(targetEle);
    }

    /**
     *POPUP表示/非表示
     * @return {JSX} ポップアップエリア 
     */
    const renderPopup = () => {
        return (isDisplayPopup)
            ?
            <div className={classes.popupArea}>
                <p>{popupInfo.text}</p>
                <img src={CloseIcon} className={classes.closeIcon} onClick={() => closePopup()}></img>
            </div>
            : undefined;
    }

    /**
     *POPUP表示ボタン押下イベント（TagElement内）
     * @param {*} popupInfo ポップアップ表示内容
     */
    const displayPopup = (popupInfo) => {
        setIsDisplayPopup(true);
        setPopupInfo(popupInfo);
        setIsPlay(false);
        player.map(p => p.pause());
    }

    /**
     *POPUP閉じるボタン押下イベント
     */
    const closePopup = () => {
        setIsDisplayPopup(false);
        setPopupInfo(initialPopupState);
    }

    const renderCreateTagLayer = () => {
        if(props.isCreatingTag){
            return <div className={classes.createTagLayer} />
        }
    }

    return(
        <>
            <div className={classes.videoPlayer}>
                <div className={classes.videoContents}>
                    {renderVideo()}
                    <div style={props.creatingTagStyle} className={classes.creatingTag}></div>
                    {renderTag()}
                    {renderCreateTagLayer()}
                    {renderPopup()}
                </div>
                <VideoController
                    switchPlay={switchPlay}
                    isPlay={isPlay}
                    mainVideo={mainVideo}
                    currentFrame={currentFrame} />
            </div>
        </>
    )
}