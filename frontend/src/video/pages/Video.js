import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// componentsインポート
import { VideoPlayer } from '../components/VideoPlayer'
import { VideoController } from '../components/VideoController'
import { TagContent } from '../components/TagContent'
import { TagForm } from '../components/TagForm'
import { TagElement } from '../components/TagElement'
import { NewTagElement } from '../components/NewTagElement'
import { PopupContent } from '../components/PopupContent'
import { StoryLayer } from '../components/StoryLayer'
import { initialVideoState, initialTagState, initialCreatingTagState } from '../components/InitialState'
import { getVideo, getStoryVideo } from '../api/video';
// デザインmodule
import classes from  '../css/Video.module.css'

export const Video = () => {

    const { videoRelationId } = useParams();

    // ローディングFLG（初回読み込み時）
    const [loading, setLoading] = useState(true);

    // video情報 [{}]
    const [video, setVideo] = useState(initialVideoState);
    // メインで表示しているVideo{}
    const [mainVideoId, setMainVideoId] = useState();
    // <video>要素配列
    const [player, setPlayer] = useState([]);
    const [mainVideoEle, setMainVideoEle] = useState(<video></video>);

    const [isPlay, setIsPlay] = useState(false);

    // タグ作成中か？
    const [isCreatingTag, setIsCreatingTag] = useState(false);

    // タグ変更時の状態
    const [creatingTagState, setCreatingTagState] = useState(initialCreatingTagState);
    // 現在のフレーム
    const [currentFrame, setCurrentFrame] = useState(0);

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

    // VideoRelationに紐づくVideo、Tag情報取得
    useEffect(() => {
        getVideo(videoRelationId)
        .then(v => {
            setVideo(v);
            setMainVideoId(v[0].id);
            setLoading(false);
        })
        .catch(e => {
            throw new Error(e);
        })
    }, []);

    // Projectの動画一覧取得（story用）
    useEffect(() => {
        getStoryVideo(videoRelationId)
        .then(v => {
            setStoryVideo(v);
        })
        .catch(e => {
            throw new Error(e);
        })
    }, []);

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
     *Video描画
     * @return {JSX} VideoPlayer
     */
    const renderVideo = () => {
        return (
            video.map((v, index) => 
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
                    setMainVideoId={setMainVideoId}
                    mainVideoId={mainVideoId}
                    setMainVideoEle={setMainVideoEle} />
            )
        )
    };

    /**
     *タグElement描画
     * @return {JSX} 
     */
    const renderTagElement = () => {
        const targetVideo = video.find(v => v.id === mainVideoId);
        const displayTag = [];
        targetVideo.tags.map(t => {
            if((t.display_frame <= currentFrame) && (currentFrame <= t.hide_frame)){
                displayTag.push(t);
            }
        });
        return displayTag.map(t =>
            <TagElement
                key={t.id}
                tag={t}
                pointerEvent={(isCreatingTag) ? 'none' : 'auto'}
                pauseVideo={pauseVideo}
                displayPopup={displayPopup}
                displayStoryLayer={displayStoryLayer} />
        );
    }

    /**
     *Form項目変更イベント 
     * @param {*} e
     */
     const handleChangeTagForm = (e, id, videoId) => {
        var newVideo = [...video]
        var value;
        switch (e.target.type) {
            case "file":
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
        console.log(storyTag)
        if(isDisplayStoryLayer){
            const targetTag = (storyTag !== undefined)
                ? storyTag
                : newTagEleState;
            return <StoryLayer {...targetTag} setIsDisplayStoryLayer={setIsDisplayStoryLayer} />
        }
    }

    /**
     *StoryLayer表示イベント
     * @param {Object} targetTag 表示するStoryタグ情報
     */
    const displayStoryLayer = (targetTag) => {
        console.log(targetTag)
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
                    setMainVideoEle={setMainVideoEle} />
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
            return <NewTagElement {...newTagEleState} isCreatingTag={isCreatingTag} displayPopup={displayPopup} displayStoryLayer={displayStoryLayer} />
        }
    }

    /**
     *currentFrame変更イベント
     * @param {number} frame
     */
    const changeCurrentFrame = (frame) => {
        setCurrentFrame(frame);
        player.map(p => {
            p.currentTime = frame / 30;
        });
    }

    return(
        <>
            {
                loading ?
                <div key='loading'>
                    <p>loading...</p>
                </div>
                :
                <>
                    <div className={classes.videoPlayer}>
                        <div className={classes.videoContents}>
                            {/* video表示 */}
                            {renderVideo()}
                            {/* タグ表示 */}
                            {renderTagElement()}
                            {/* 新規タグ */}
                            {renderNewTagEle()}
                            {/* 領域指定ボタン押下後のレイヤー */}
                            {renderCreateTagLayer()}
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
                            mainVideoId={mainVideoId}
                            mainVideoEle={mainVideoEle} />
                    </div>
                    {/* タグフォーム */}
                    <div className={classes.tagWrap} >
                        { renderTagContent() }
                        <TagForm
                            mainVideoId={mainVideoId}
                            video={video}
                            setVideo={setVideo}
                            createTagArea={createTagArea}
                            newTagEleState={newTagEleState}
                            setNewTagEleState={setNewTagEleState}
                            setIsCreatingTag={setIsCreatingTag}
                            changeCurrentFrame={changeCurrentFrame}
                            storyVideo={storyVideo}
                            mainVideoId={mainVideoId} />
                    </div>
                </>
            }
        </>
    )

}