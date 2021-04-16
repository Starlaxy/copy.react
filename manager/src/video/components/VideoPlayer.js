import React, { useState, useRef, useEffect } from "react"

import classes from  '../css/VideoPlayer.module.css'

export const VideoPlayer = React.memo(props => {

    const ref = useRef();

    const [isPointerDown, setIsPointerDown] = useState(false);
    const mainVideoFlg = (props.id === props.mainVideoId);

    const src = 'http://localhost:8000' + props.video;
    const pointerEvent = (props.isCreatingTag) ? 'none' : 'auto';

    const style = (mainVideoFlg)
    ? { 
        width: '100%' 
    }
    : {
         width: '200px',
         position: 'absolute',
         bottom: '20px',
         right: ((props.index - 1) * 200) + 20 + 'px',
         pointerEvents: pointerEvent,
         zIndex: 1,
    };

    // 動画読み込み時にplayerに追加
    useEffect(() => {
        props.player.push(ref.current);
    }, []);

    /**
     *ビデオ読み込み後Durationセット（MAINVIDEOのみ）
     *
     * @param {videoElement}
     */
    const loadedMetadata = (target) => {
        props.setMainVideoEle(target);
        props.setIsLoadingVideo(false);
        props.setTotalFrame(Math.ceil(target.duration * props.fps));
    }

    /**
     *動画終了時イベント
     */
    const onEnded = () => {
        props.setIsPlay(false);
    }

    /**
     *領域指定ボタン押下後のマウスダウンイベント
     *タグの大きさ、場所を設定
     * @param {PointerEvent} e
     */
    const createTagPointerDown = (e) => {
        setIsPointerDown(true);
        props.setCreatingTagState({
            ...props.creatingTagState,
            startX: e.nativeEvent.offsetX,
            startY: e.nativeEvent.offsetY,
        });
        e.target.setPointerCapture(e.pointerId);
    };

    /**
     *タグ作成時、PointerDOWN後のPointerMOVEイベント
     * @param {PointerEvent} e
     */
    const createTagPointerMove = (e) => {
        // px単位で管理するとwindowサイズにより、相違が生まれるため％で管理
        const adjustmentLeft = Math.max(0, Math.min(props.creatingTagState.startX, e.nativeEvent.offsetX));
        const adjustmentTop = Math.max(0, Math.min(props.creatingTagState.startY, e.nativeEvent.offsetY));
        const adjustmentRight = Math.min(e.target.clientWidth, Math.max(props.creatingTagState.startX, e.nativeEvent.offsetX));
        const adjustmentBottom = Math.min(e.target.clientHeight, Math.max(props.creatingTagState.startY, e.nativeEvent.offsetY));
        const width = (adjustmentRight - adjustmentLeft) / e.target.clientWidth * 100;
        const height = (adjustmentBottom - adjustmentTop) / e.target.clientHeight * 100;
        const left = adjustmentLeft / e.target.clientWidth * 100;
        const top = adjustmentTop / e.target.clientHeight * 100;
        // 既存のタグ修正時
        if(props.creatingTagState.id !== -1){
            const newVideo = [...props.all_video];
            newVideo.map(nv => {
                nv.tags.map(nt => {
                    if(nt.id === props.creatingTagState.id){
                        // 5桁以下で管理したいため、*100/100
                        nt.width = Math.floor(width * 100) / 100;
                        nt.height = Math.floor(height * 100) / 100;
                        nt.left = Math.floor(left * 100) / 100;
                        nt.top = Math.floor(top * 100) / 100;
                    }
                });
            });
            props.setVideo(newVideo);
        }
        // 新規タグ作成
        else {
            props.setNewTagEleState({
                ...props.newTagEleState,
                width: Math.floor(width * 100) / 100,
                height: Math.floor(height * 100) / 100,
                left: Math.floor(left * 100) / 100,
                top: Math.floor(top * 100) / 100,
            });
        }
    }

    /**
     *領域指定ボタン押下後のマウスアップイベント
     *タグの大きさ、場所を設定(%)
     * @param {PointerEvent} e
     */
    const createTagPointerUp = (e) => {
        props.setIsCreatingTag(false);
        setIsPointerDown(false);
        e.target.releasePointerCapture(e.pointerId);
    }

    /**
     *サブ動画クリックイベント(Swiching機能)
     * @param {VideoElement}
     */
    const changeVideo = (target) => {
        props.setMainVideoId(Number(target.id));
        props.setMainVideoEle(target);
    }

    return(
        <>
            <video muted
                id={props.id}
                style={style}
                ref={ref}
                onLoadedMetadata={(mainVideoFlg) ? () => loadedMetadata(ref.current) : undefined}
                onEnded={(mainVideoFlg) ? () => onEnded() : undefined}
                onPointerDown={(mainVideoFlg && props.isCreatingTag) ? (e) => createTagPointerDown(e) : undefined}
                onPointerMove={(mainVideoFlg && isPointerDown) ? (e) => createTagPointerMove(e) : undefined}
                onPointerUp={(mainVideoFlg && isPointerDown) ? (e) => createTagPointerUp(e): undefined}
                onClick={(!mainVideoFlg) ? () => changeVideo(ref.current) : undefined} >
                <source src={src} />
            </video>
        </>
    )
});