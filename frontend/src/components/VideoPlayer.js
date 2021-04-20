import React, { useState, useRef, useEffect } from "react"

// import classes from  '../css/VideoPlayer.module.css'

export const VideoPlayer = React.memo(props => {

    const src = 'http://localhost:8000' + props.video;
    const mainVideoFlg = (props.id === props.mainVideoId);

    const ref = useRef();

    const style = (mainVideoFlg)
    ? { 
        width: '100%',
    }
    : {
        width: '200px',
        position: 'absolute',
        bottom: '20px',
        right: ((props.index - 1) * 200) + 20 + 'px',
        zIndex: 1,
    };

    useEffect(() => {
        props.player.push(ref.current);
    }, []);

    /**
     *ビデオ読み込み後Durationセット（MAINVIDEOのみ）
     * @param {videoElement}
     */
    const loadedMetadata = (target) => {
        target.muted = false;
        props.setIsLoadingVideo(false);
        props.setMainVideoEle(target);
        props.setMainVideoId(Number(target.id))
        props.setTotalFrame(target.duration * props.fps)
    }

    /**
     *サブ動画クリックイベント(Swiching機能)
     * @param {VideoElement}
     */
    const changeVideo = (target) => {
        props.setMainVideoId(Number(target.id));
    }

    return(
        <>
            <video
                id={props.id}
                muted
                ref={ref}
                style={style}
                onLoadedMetadata={(mainVideoFlg) ? () => loadedMetadata(ref.current) : undefined}
                onClick={(!mainVideoFlg) ? () => changeVideo(ref.current) : undefined} >
                <source src={src} />
            </video>
        </>
    )
});