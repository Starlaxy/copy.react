import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { VideoPlayer } from '../components/VideoPlayer'
import { VideoController } from '../components/VideoController'
import { TagElement } from '../components/TagElement'
import { PopupContent } from '../components/PopupContent'

import { initialVideoState } from '../components/InitialState'
import { getRelatedVideo } from '../api/video';

import { getDecryptedString } from '../components/Crypto'

// 画像import
import LoadingImg from '../images/loading.gif'

// デザインmodule
import classes from  '../css/Video.module.css'

export const Video = () => {

    const { id } = useParams();

    const [videoRelation, setVideoRelation]= useState(initialVideoState);
    const [isPlay, setIsPlay] = useState(false);

    const [mainVideoId, setMainVideoId] = useState();
    const [mainVideoRelationId, setMainVideoRelationId] = useState();
    const [player, setPlayer] = useState([]);
    const [mainVideoEle, setMainVideoEle] = useState(document.createElement("video"));

    const [currentFrame, setCurrentFrame] = useState(0);
    const [totalFrame, setTotalFrame] = useState(0);

    const fps = 30;

    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isLoadingVideo, setIsLoadingVideo] = useState(true);

    const [isDisplayPopup, setIsDisplayPopup] = useState(false);
    const [popupTag, setPopupTag] = useState();

    // VideoRelationに紐づくVideo、Tag情報取得
    useEffect(() => {
        getRelatedVideo(getDecryptedString(id))
        .then(vr => {
            setVideoRelation(vr);
            setMainVideoRelationId(vr[0].id);
            setMainVideoId(vr[0].videos[0].id)
            setIsLoadingData(false);
        })
        .catch(e => {
            throw new Error(e);
        })
    }, []);

    useEffect(() => {
        if(player.find(p=> Number(p.id) === mainVideoId)){
            setMainVideoEle(player.find(p=> Number(p.id) === mainVideoId));
        }
    }, [mainVideoId])

    const renderVideo = () => {
        return (
            videoRelation.map(vr => (
                <div key={vr.id} className={(vr.id !== mainVideoRelationId) ? classes.hideVideo : undefined}>
                    {
                        vr.videos.map((v, index) => (
                            <VideoPlayer
                                key={v.id}
                                {...v}
                                index={index}
                                setIsLoadingVideo={setIsLoadingVideo}
                                mainVideoId={mainVideoId}
                                setMainVideoId={setMainVideoId}
                                player={player}
                                setMainVideoEle={setMainVideoEle}
                                setTotalFrame={setTotalFrame}
                                fps={fps} />
                        ))
                    }
                </div>
            ))
        )
    }

    /**
     *タグElement描画
     * @return {JSX} 
     */
    const renderTagElement = () => {
        return videoRelation.map(vr =>(
            vr.videos.map(v => v.tags.map(t => {
                if((t.display_frame <= currentFrame) && (currentFrame <= t.hide_frame) && (v.id === mainVideoId)){
                    return (
                        <TagElement
                            key={t.id}
                            tag={t}
                            pauseVideo={pauseVideo}
                            displayPopup={displayPopup}
                            setMainVideoId={setMainVideoId}
                            videoRelation={videoRelation}
                            setMainVideoRelationId={setMainVideoRelationId}
                            changeCurrentFrame={changeCurrentFrame} />
                    )
                }
            }))
        ))
    }

    /**
     *動画再生イベント
     */
    const playVideo = () => {
        player.map(p => p.play());
        setIsPlay(true);
    }

    /**
     *動画停止イベント
     */
    const pauseVideo = () => {
        player.map(p => p.pause());
        setIsPlay(false);
    }

    /**
     *currentFrame変更イベント
     * @param {number} frame
     */
    const changeCurrentFrame = (frame) => {
        setCurrentFrame(frame);
        player.map(p => {
            p.currentTime = frame / fps;
        });
    }

    /**
     *POPUP描画
     * @return {JSX} ポップアップエリア 
     */
    const renderPopup = () => {
        if(isDisplayPopup){
            return <PopupContent setIsDisplayPopup={setIsDisplayPopup} {...popupTag} />
        }
    }

    /**
     *POPUP表示
     * @param {Object} targetTag 表示するPOPUPタグ情報
     */
    const displayPopup = (targetTag) => {
        setPopupTag(targetTag);
        setIsDisplayPopup(true);
        pauseVideo();
    }

    return(
        <>
            { isLoadingData
                ?
                <div className={classes.loadingLayer}>
                    <img src={LoadingImg} />
                    <p className={classes.loadingText}>Loading...</p>
                </div>
                :
                <>
                    {isLoadingVideo &&
                        <div className={classes.loadingLayer}>
                            <img src={LoadingImg} />
                            <p className={classes.loadingText}>Loading...</p>
                        </div>
                    }
                    <div className={classes.videoContents}>
                        {renderVideo()}
                        {renderTagElement()}
                        {/* POPUPエリア */}
                        {renderPopup()}
                    </div>
                    <VideoController
                        isPlay={isPlay}
                        mainVideoEle={mainVideoEle}
                        currentFrame={currentFrame}
                        setCurrentFrame={setCurrentFrame}
                        playVideo={playVideo}
                        pauseVideo={pauseVideo}
                        changeCurrentFrame={changeCurrentFrame}
                        fps={fps}
                        totalFrame={totalFrame} />
                </>
            }
        </>
    )
}