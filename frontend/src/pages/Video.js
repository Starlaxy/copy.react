import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { VideoPlayer } from '../components/VideoPlayer'
import { ThreeDimVideoPlayer } from '../components/ThreeDimVideoPlayer'
import { VideoController } from '../components/VideoController'
import { TagElement } from '../components/TagElement'
import { PopupContent } from '../components/PopupContent'

import { initialVideoState } from '../components/InitialState'
import { getRelatedVideo } from '../api/video';

import { getDecryptedString } from '../components/Crypto'

// 画像import
import LoadingImg from '../images/loading.gif'
import BackImg from '../images/back_btn.png'

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

    // 360度動画
    const [lon, setLon] = useState(0);
    const [lat, setLat] = useState(90);
    const [isMoveVideo, setIsMoveVideo] = useState(false);

    // story
    const [isStory, setIsStory] = useState(false);
    const [storyTransition, setStoryTransition] = useState([]);

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

    // mainVideoIdのVideoElement格納
    useEffect(() => {
        const targetVideo = player.find(p=> Number(p.id) === mainVideoId);
        if(targetVideo){
            player.map(p => p.muted = true);
            setMainVideoEle(targetVideo);
            targetVideo.muted = false;
        }
    }, [mainVideoId]);

    
    /**
     *Video描画
     * @return {JSX} VideoElement 
     */
    const renderVideo = () => {
        return (
            videoRelation.map(vr => (
                <div key={vr.id} className={(vr.id !== mainVideoRelationId) ? classes.hideVideo : undefined}>
                    {
                        vr.videos.map((v, index) => {
                            if(v.three_dimensional_flg){
                                return (
                                    <ThreeDimVideoPlayer
                                        key={v.id}
                                        {...v}
                                        player={player}
                                        mainVideoId={mainVideoId}
                                        setMainVideoId={setMainVideoId}
                                        lon={lon}
                                        lat={lat}
                                        setLon={setLon}
                                        setLat={setLat}
                                        isMoveVideo={isMoveVideo}
                                        setIsMoveVideo={setIsMoveVideo}
                                        setIsLoadingVideo={setIsLoadingVideo}
                                        fps={fps}
                                        setTotalFrame={setTotalFrame}
                                        setIsPlay={setIsPlay}
                                        setMainVideoEle={setMainVideoEle} />
                                )
                            }
                            else{
                                return (
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
                                )
                            }
                        })
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
                            mainVideoId={mainVideoId}
                            setMainVideoId={setMainVideoId}
                            videoRelation={videoRelation}
                            mainVideoRelationId={mainVideoRelationId}
                            setMainVideoRelationId={setMainVideoRelationId}
                            changeCurrentFrame={changeCurrentFrame}
                            isMoveVideo={isMoveVideo}
                            three_dimensional_flg={v.three_dimensional_flg}
                            lon={lon}
                            lat={lat}
                            currentFrame={currentFrame}
                            setIsStory={setIsStory}
                            storyTransition={storyTransition}
                            setStoryTransition={setStoryTransition} />
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

    const renderStoryBackImg = () => {
        if(isStory){
            return <img className={classes.storyBackImg} src={BackImg} onClick={() => storyBack()} />
        }
    }

    const storyBack = () => {
        const targetData = storyTransition[storyTransition.length - 1];
        setMainVideoRelationId(targetData.videoRelationId);
        setMainVideoId(targetData.videoId);
        changeCurrentFrame(targetData.currentFrame);
        storyTransition.pop();
        if(storyTransition.length === 0){
            setIsStory(false);
        }
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
                        {renderStoryBackImg()}
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