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

    const [player, setPlayer] = useState([]);
    const [mainVideo, setMainVideo] = useState(<video></video>);
    const [isPlay, setIsPlay] = useState(false);

    // タグ作成中か？
    const [isCreatingTag, setIsCreatingTag] = useState(false);
    const [isMouseDown, setIsMouseDown] = useState(false);

    // タグ変更時の状態
    const [creatingTagState, setCreatingTagState] = useState(initialCreatingTagState);
    // 現在のフレーム
    const [currentFrame, setCurrentFrame] = useState(0);

    // 新規タグ情報
    const [newTagEleState, setNewTagEleState] = useState(initialTagState);

    // POPUPの情報
    const [popupIds, setPopupIds] = useState({
        videoId: undefined,
        tagId: undefined,
    });
    // POPUP表示中か？
    const [isDisplayPopup, setIsDisplayPopup] = useState(false);

    // storyVideo
    const [storyVideo, setStoryVideo] = useState([initialVideoState])

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
    }, [])

    /**
     *Video描画
     * @return {JSX} VideoPlayer
     */
    const renderVideo = () => {
        const [first, ...rest] = video;
        const pointerEvent = (isCreatingTag) ? 'none' : 'auto';
        const subVideoWrapStyle = {
            pointerEvents: pointerEvent
        }
        return (
            <>
                {first &&
                    <VideoPlayer
                        key={first.id}
                        {...first}
                        mainVideoFlg={true}
                        player={player}
                        setMainVideo={setMainVideo}
                        setIsPlay={setIsPlay}
                        createTagMouseDown={(isCreatingTag) ? createTagMouseDown : undefined}
                        createTagMouseMove={(isMouseDown) ? createTagMouseMove : undefined}
                        createTagMouseUp={(isMouseDown) ? createTagMouseUp : undefined} />
                }
                <div className={classes.subVideoWrap} style={subVideoWrapStyle}>
                    {rest.map(v => 
                        <VideoPlayer
                            key={v.id}
                            {...v}
                            mainVideoFlg={false}
                            player={player}
                            all_video={video}
                            setVideo={setVideo}
                            mainVideo={mainVideo}
                            setMainVideo={setMainVideo} />
                    )}
                </div>
            </>
        )
    };

    /**
     *タグElement描画
     * @return {JSX} 
     */
    const renderTagElement = () => {
        const [first] = video;
        const displayTag = [];
        first.tags.map(t => {
            if((t.display_frame <= currentFrame) && (currentFrame <= t.hide_frame)){
                displayTag.push(t);
            }
        });
        return displayTag.map(t =>
            <TagElement key={t.id} {...t} displayPopup={displayPopup} pointerEvent={(isCreatingTag) ? 'none' : 'auto'} />
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
        setVideo(newVideo)
    }

    /**
     *POPUP描画
     * @return {JSX} ポップアップエリア 
     */
    const renderPopup = () => {
        if(isDisplayPopup){
            const targetTag = video.find(v => v.id === popupIds.videoId).tags.find(t => t.id === popupIds.tagId);
            return <PopupContent {...targetTag} setIsDisplayPopup={setIsDisplayPopup} />
        }
    }

    /**
     *POPUP表示
     * @param {number} POPUPを表示するタグID
     * @param {number} POPUPを表示するビデオID
     */
    const displayPopup = (tagId, videoId) => {
        setPopupIds({
            videoId: videoId,
            tagId: tagId,
        });
        setIsDisplayPopup(true);
        setIsPlay(false);
        player.map(p => p.pause());
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
                    storyVideo={storyVideo} />
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
        player.map(p => p.pause());
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
     *領域指定ボタン押下後のマウスダウンイベント
     *タグの大きさ、場所を設定
     * @param {MouseEvent} e
     */
    const createTagMouseDown = (e) => {
        setIsMouseDown(true);
        setCreatingTagState({
            ...creatingTagState,
            startX: e.nativeEvent.offsetX,
            startY: e.nativeEvent.offsetY,
        });
    };

    /**
     *タグ作成時、MOUSEDOWN後のMOUSEMOVEイベント
     * @param {MouseEvent} e
     */
    const createTagMouseMove = (e) => {
        // px単位で管理するとwindowサイズにより、相違が生まれるため％で管理
        const width = (Math.max(e.nativeEvent.offsetX, creatingTagState.startX) - Math.min(e.nativeEvent.offsetX, creatingTagState.startX)) / e.target.clientWidth * 100;
        const height = (Math.max(e.nativeEvent.offsetY, creatingTagState.startY) - Math.min(e.nativeEvent.offsetY, creatingTagState.startY)) / e.target.clientHeight * 100;
        const left = Math.min(creatingTagState.startX, e.nativeEvent.offsetX) / e.target.clientWidth * 100;
        const top = Math.min(creatingTagState.startY, e.nativeEvent.offsetY) / e.target.clientHeight * 100;
        // 既存のタグ修正時
        if(creatingTagState.id !== -1){
            const newVideo = [...video];
            newVideo.map(nv => {
                nv.tags.map(nt => {
                    if(nt.id === creatingTagState.id){
                        // 5桁以下で管理したいため、*100/100
                        nt.width = Math.floor(width * 100) / 100;
                        nt.height = Math.floor(height * 100) / 100;
                        nt.left = Math.floor(left * 100) / 100;
                        nt.top = Math.floor(top * 100) / 100;
                    }
                });
            });
            setVideo(newVideo);
        }
        // 新規タグ作成
        else {
            setNewTagEleState({
                ...newTagEleState,
                width: Math.floor(width * 100) / 100,
                height: Math.floor(height * 100) / 100,
                left: Math.floor(left * 100) / 100,
                top: Math.floor(top * 100) / 100,
            });
        }
    }

    /**
     *新規タグ作成時に表示するタグ
     * @return {*} 
     */
    const renderNewTagEle = () => {
        if ((newTagEleState !== initialTagState) && (newTagEleState.display_frame <= currentFrame) && (currentFrame <= newTagEleState.hide_frame)){
            return <NewTagElement {...newTagEleState} isCreatingTag={isCreatingTag} />
        }
    }

    /**
     *領域指定ボタン押下後のマウスアップイベント
     *タグの大きさ、場所を設定(%)
     * @param {MouseEvent} e
     */
    const createTagMouseUp = (e) => {
        setIsCreatingTag(false);
        setIsMouseDown(false);
    }

    /**
     *currentFrame変更イベント
     * @param {number} frame
     */
    const changeCurrentFrame = (frame) => {
        setCurrentFrame(frame);
        mainVideo.currentTime = frame / 30;
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
                        </div>
                        {/* ビデオコントロールバー */}
                        <VideoController
                            mainVideo={mainVideo}
                            isPlay={isPlay}
                            setIsPlay={setIsPlay}
                            player={player}
                            currentFrame={currentFrame}
                            setCurrentFrame={setCurrentFrame} />
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
                            storyVideo={storyVideo} />
                    </div>
                </>
            }
        </>
    )

}