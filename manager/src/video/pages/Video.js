import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
// componentsインポート
import { VideoPlayer } from '../components/VideoPlayer'
import { ThreeDimVideoPlayer } from '../components/ThreeDimVideoPlayer'
import { VideoController } from '../components/VideoController'
import { TagContent } from '../components/TagContent'
import { TagForm } from '../components/TagForm'
import { TagElement } from '../components/TagElement'
import { NewTagElement } from '../components/NewTagElement'
import { PopupContent } from '../components/PopupContent'
import { StoryLayer } from '../components/StoryLayer'
import { initialVideoState, initialTagState, initialCreatingTagState } from '../components/InitialState'
import { getVideo, getStoryVideo } from '../api/video';
import { deleteTag } from '../api/tag';
import { Confirm } from '../../common/components/Confirm'

import { getDecryptedString } from '../../common/components/Crypto'

// 画像import
import LoadingImg from '../../images/video/loading.gif'

// デザインmodule
import classes from  '../css/Video.module.css'

export const Video = () => {

    const { videoRelationId } = useParams();

    // APIローディングFLG（初回読み込み時）
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isLoadingVideo, setIsLoadingVideo] = useState(true);

    // video情報 [{}]
    const [video, setVideo] = useState([initialVideoState]);
    // メインで表示しているVideo{}
    const [mainVideoId, setMainVideoId] = useState();
    // <video>要素配列
    const [player] = useState([]);
    const [mainVideoEle, setMainVideoEle] = useState(<video></video>);

    const [isPlay, setIsPlay] = useState(false);

    // フルスクリーン化する要素（VideoPlayer/VideoController）
    const fullScreenElm = useRef();
    const [isFullScreen, setIsFullScreen] = useState(false);

    // タグ作成中か？
    const [isCreatingTag, setIsCreatingTag] = useState(false);

    // タグ変更時の状態
    const [creatingTagState, setCreatingTagState] = useState(initialCreatingTagState);
    // 現在のフレーム
    const [currentFrame, setCurrentFrame] = useState(0);
    // fps
    const fps = 30;
    // MAINVIDEOのフレーム数
    const [totalFrame, setTotalFrame] = useState(0);

    // 新規タグ情報
    const [newTagEleState, setNewTagEleState] = useState(initialTagState);

    // POPUPの情報
    const [popupTag, setPopupTag] = useState();
    // POPUP表示中か？
    const [isDisplayPopup, setIsDisplayPopup] = useState(false);

    // storyVideo
    const [storyVideo, setStoryVideo] = useState([initialVideoState]);
    const [storyTag, setStoryTag] = useState();
    // Storyタグ押下時のレイヤー表示フラグ
    const [isDisplayStoryLayer, setIsDisplayStoryLayer] = useState(false);

    // 360度動画設定
    const [canMove, setCanMove] = useState(false);
    const [lon, setLon] = useState(0);
    const [lat, setLat] = useState(90);
    const [videoWrapStyle, setVideoWrapStyle] = useState();

    // タグ削除時のConfirmModal表示フラグ
    const [isShowConfirmModal, setIsConfirmModal] = useState(false);
    const [deleteTagInfo, setDeleteTagInfo] = useState({id: 0, title: ''});

    // VideoRelationに紐づくVideo、Tag情報取得
    useEffect(() => {
        getVideo(getDecryptedString(videoRelationId))
        .then(v => {
            setVideo(v);
            setMainVideoId(v[0].id);
            setIsLoadingData(false);
        })
        .catch(e => {
            throw new Error(e);
        })
    }, [videoRelationId]);

    // Projectの動画一覧取得（story用）
    useEffect(() => {
        getStoryVideo(getDecryptedString(videoRelationId))
        .then(v => {
            setStoryVideo(v);
        })
        .catch(e => {
            throw new Error(e);
        })
    }, [videoRelationId]);

    // totalFrame変更イベント
    useEffect(() => {
        if(mainVideoEle.duration){
            setTotalFrame(Math.ceil(mainVideoEle.duration * fps))
        }
    }, [mainVideoEle]);

    /**
     *動画再生イベント
     */
    const playVideo = () => {
        player.forEach(p => p.play());
        setIsPlay(true);
    }

    /**
     *動画停止イベント
     */
    const pauseVideo = () => {
        player.forEach(p => p.pause());
        setIsPlay(false);
    }

    /**
     *Video描画
     * @return {JSX} VideoPlayer
     */
    const renderVideo = () => {
        return (
            video.map((v, index) => {
                if(index === 0 && videoWrapStyle === undefined){
                    setVideoWrapStyle(
                        (v.three_dimensional_flg)
                            ? {width: '100%', height: '100%'}
                            : {maxWidth: '100%', maxHeight: '100%'}
                    )
                }
                if(v.three_dimensional_flg){
                    return (
                        <ThreeDimVideoPlayer
                            key={v.id}
                            {...v}
                            index={index}
                            player={player}
                            mainVideoId={mainVideoId}
                            setMainVideoId={setMainVideoId}
                            setMainVideoEle={setMainVideoEle}
                            isCreatingTag={isCreatingTag}
                            setIsCreatingTag={setIsCreatingTag}
                            creatingTagState={creatingTagState}
                            setCreatingTagState={setCreatingTagState}
                            all_video={video}
                            setVideo={setVideo}
                            newTagEleState={newTagEleState}
                            setNewTagEleState={setNewTagEleState}
                            lon={lon}
                            lat={lat}
                            setLon={setLon}
                            setLat={setLat}
                            canMove={canMove}
                            setCanMove={setCanMove}
                            setIsLoadingVideo={setIsLoadingVideo}
                            fps={fps}
                            setIsPlay={setIsPlay} />
                    )
                }
                else{
                    return (
                        <VideoPlayer
                            key={v.id}
                            index={index}
                            {...v}
                            player={player}
                            setIsPlay={setIsPlay}
                            creatingTagState={creatingTagState}
                            setCreatingTagState={setCreatingTagState}
                            setVideo={setVideo}
                            newTagEleState={newTagEleState}
                            setNewTagEleState={setNewTagEleState}
                            isCreatingTag={isCreatingTag}
                            setIsCreatingTag={setIsCreatingTag}
                            all_video={video}
                            mainVideoId={mainVideoId}
                            setMainVideoId={setMainVideoId}
                            setMainVideoEle={setMainVideoEle}
                            setIsLoadingVideo={setIsLoadingVideo}
                            fps={fps} />
                    )
                }
            })
        )
    };

    /**
     *タグElement描画
     * @return {JSX} 
     */
    const renderTagElement = () => {
        return video.map(v => v.tags.map(t => {
            if((t.display_frame <= currentFrame) && (currentFrame <= t.hide_frame) && (v.id === mainVideoId)){
                return (
                    <TagElement
                        key={t.id}
                        tag={t}
                        pointerEvent={(isCreatingTag || canMove) ? 'none' : 'auto'}
                        pauseVideo={pauseVideo}
                        displayPopup={displayPopup}
                        displayStoryLayer={displayStoryLayer}
                        three_dimensional_flg={v.three_dimensional_flg}
                        lon={lon}
                        lat={lat} />
                )
            }
        }));
    }

    /**
     *Form項目変更イベント 
     * @param {*} e
     */
     const handleChangeTagForm = (e, id, videoId) => {
        let newVideo = [...video]
        let value;
        switch (e.target.name) {
            case "display_frame":
                value = (e.target.value < 0) ? 0 : e.target.value;
                setCurrentFrame(value);
                break;

            case "hide_frame":
                value = (totalFrame < e.target.value) ? totalFrame : e.target.value;
                setCurrentFrame(value);
                break;

            case "popup_img":
                value = e.target.files[0];
                break;
        
            default:
                value = e.target.value
                break;
        }
        newVideo.find(nv => nv.id === videoId).tags.find(t => t.id === id)[e.target.name] = value;
        setVideo(newVideo);
    }

    /**
     *POPUP描画
     * @return {JSX} ポップアップエリア 
     */
    const renderPopup = () => {
        if(isDisplayPopup){
            // 新規タグならnewTagEleState(Form)の情報で表示
            const targetTag = (popupTag !== undefined)
                ? popupTag
                : newTagEleState
            return <PopupContent {...targetTag} setIsDisplayPopup={setIsDisplayPopup} />
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

    /**
     *Storyタグ描画
     * @return {*} 
     */
    const renderStoryLayer = () => {
        if(isDisplayStoryLayer){
            const targetTag = (storyTag !== undefined)
                ? storyTag
                : newTagEleState;
            return <StoryLayer {...targetTag} setIsDisplayStoryLayer={setIsDisplayStoryLayer} storyVideo={storyVideo} />
        }
    }

    /**
     *StoryLayer表示イベント
     * @param {Object} targetTag 表示するStoryタグ情報
     */
    const displayStoryLayer = (targetTag) => {
        setStoryTag(targetTag);
        setIsDisplayStoryLayer(true);
        pauseVideo();
    }

    /**
     *ビデオに紐づくタグ情報すべて表示
     *
     * @return {JSX} TagContent 
     */
    const renderTagContent = () => {
        return video.map(
            v => v.tags.map( t => 
                <TagContent
                    key={t.id}
                    {...t}
                    createTagArea={createTagArea}
                    all_video={video}
                    setVideo={setVideo}
                    changeCurrentFrame={changeCurrentFrame}
                    handleChangeTagForm={handleChangeTagForm}
                    storyVideo={storyVideo}
                    setMainVideoId={setMainVideoId}
                    player={player}
                    setMainVideoEle={setMainVideoEle}
                    showConfirmModal={showConfirmModal} />
            )
        )
    }

    /**
     *領域指定ボタン押下イベント
     * @param {number} id
     * @param {MouseEvent} e
     */
    const createTagArea = (e, id = -1) => {
        e.preventDefault();
        setIsCreatingTag(true);
        pauseVideo();
        setCreatingTagState({...creatingTagState, id: id})
    }

    /**
     *領域指定ボタン押下時にVideoにレイヤーをかける
     * @return {JSX} 
     */
    const renderCreateTagLayer = () => {
        if(isCreatingTag){
            return <div className={classes.createTagLayer} />
        }
    }

    /**
     *新規タグ作成時に表示するタグ
     * @return {*} 
     */
    const renderNewTagEle = () => {
        if ((newTagEleState !== initialTagState) && (newTagEleState.display_frame <= currentFrame) && (currentFrame <= newTagEleState.hide_frame)){
            return (
                <NewTagElement
                    pointerEvent={(isCreatingTag || canMove) ? 'none' : 'auto'}
                    {...newTagEleState}
                    isCreatingTag={isCreatingTag}
                    displayPopup={displayPopup}
                    displayStoryLayer={displayStoryLayer}
                    three_dimensional_flg={video.find(v => v.id === mainVideoId).three_dimensional_flg}
                    lon={lon}
                    lat={lat} />
            )
        }
    }

    /**
     *currentFrame変更イベント
     * @param {number} frame
     */
    const changeCurrentFrame = (frame) => {
        setCurrentFrame(frame);
        player.forEach(p => {
            p.currentTime = frame / 30;
        });
    }

    /**
     *タグ削除ボタン押下イベント
     * @param {onClick} e
     */
     const handleDeleteTag = () => {
        deleteTag(deleteTagInfo.id)
        .then(t => {
            let newVideo = [...video];
            newVideo.forEach(nv => {
                nv.tags = nv.tags.filter(nt => nt.id !== deleteTagInfo.id)
            });
            setVideo(newVideo);
            setIsConfirmModal(false);
        })
        .catch(e => {
            throw new Error(e);
        });
    }

    /**
     *isShowConfirmModal true時にConfirmComponent表示
     * @return {JSX} ConfirmComponent
     */
     const renderConfirmModal = () => {
        if(isShowConfirmModal){
            const confirmTitle = `${deleteTagInfo.title}削除`;
            const confirmDesc = `「${deleteTagInfo.title}」を削除します。\nよろしいですか？`;
            return <Confirm title={confirmTitle} description={confirmDesc} confirmEvent={handleDeleteTag} setIsConfirmModal={setIsConfirmModal} /> 
        }
    }

    /**
     *ConfirmComponent表示フラグTrue切り替え
     * @param {MouseEvent} e
     */
    const showConfirmModal = (e, id, title) => {
        e.preventDefault();
        setDeleteTagInfo({id: id, title: title});
        setIsConfirmModal(true);
    }

    /**
     *動画フルスクリーン化
     */
    const handleFullScreen = () => {
        if(!isFullScreen){
            if (fullScreenElm.current.webkitRequestFullscreen) {
                fullScreenElm.current.webkitRequestFullscreen(); //Chrome15+, Safari5.1+, Opera15+
            } else if (fullScreenElm.current.mozRequestFullScreen) {
                fullScreenElm.current.mozRequestFullScreen(); //FF10+
            } else if (fullScreenElm.current.msRequestFullscreen) {
                fullScreenElm.current.msRequestFullscreen(); //IE11+
            } else if (fullScreenElm.current.requestFullscreen) {
                fullScreenElm.current.requestFullscreen(); // HTML5 Fullscreen API仕様
            } else {
                alert('ご利用のブラウザはフルスクリーン操作に対応していません');
                return;
            }
        }
        else{
            if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen(); //Chrome15+, Safari5.1+, Opera15+
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen(); //FF10+
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen(); //IE11+
            } else if(document.cancelFullScreen) {
                document.cancelFullScreen(); //Gecko:FullScreenAPI仕様
            } else if(document.exitFullscreen) {
                document.exitFullscreen(); // HTML5 Fullscreen API仕様
            }
        }
        setIsFullScreen(!isFullScreen);
    }

    return(
        <>
            { isLoadingData
                ?
                <div className={classes.loadingDataLayer}>
                    <img src={LoadingImg} alt='LoadingImg' />
                    <p className={classes.loadingText}>Loading...</p>
                </div>
                :
                <>
                    {renderConfirmModal()}
                    <div className={classes.videoPlayer} ref={fullScreenElm}>
                        {isLoadingVideo &&
                            <div className={classes.loadingLayer}>
                                <img src={LoadingImg} alt='LoadingImg' />
                                <p className={classes.loadingText}>Loading...</p>
                            </div>
                        }
                        <div className={classes.videoContents}>
                            <div className={classes.videoWrap} style={videoWrapStyle}>
                                {/* video表示 */}
                                {renderVideo()}
                                {/* タグ表示 */}
                                {renderTagElement()}
                                {/* 新規タグ */}
                                {renderNewTagEle()}
                                {/* 領域指定ボタン押下後のレイヤー */}
                                {renderCreateTagLayer()}
                            </div>
                            {/* POPUPエリア */}
                            {renderPopup()}
                            {/* StoryLayer */}
                            {renderStoryLayer()}
                        </div>
                        {/* ビデオコントロールバー */}
                        <VideoController
                            isPlay={isPlay}
                            setIsPlay={setIsPlay}
                            pauseVideo={pauseVideo}
                            playVideo={playVideo}
                            currentFrame={currentFrame}
                            setCurrentFrame={setCurrentFrame}
                            changeCurrentFrame={changeCurrentFrame}
                            mainVideoId={mainVideoId}
                            mainVideoEle={mainVideoEle}
                            fps={fps}
                            totalFrame={totalFrame}
                            isFullScreen={isFullScreen}
                            handleFullScreen={handleFullScreen} />
                    </div>
                    {/* タグフォーム */}
                    <div className={classes.tagWrap} >
                        { renderTagContent() }
                        <TagForm
                            video={video}
                            setVideo={setVideo}
                            createTagArea={createTagArea}
                            newTagEleState={newTagEleState}
                            setNewTagEleState={setNewTagEleState}
                            setIsCreatingTag={setIsCreatingTag}
                            currentFrame={currentFrame}
                            changeCurrentFrame={changeCurrentFrame}
                            storyVideo={storyVideo}
                            mainVideoId={mainVideoId}
                            totalFrame={totalFrame} />
                    </div>
                </>
            }
        </>
    )

}