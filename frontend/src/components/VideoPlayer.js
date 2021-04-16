import React, { useState, useRef, useEffect } from "react"

// import classes from  '../css/VideoPlayer.module.css'

export const VideoPlayer = React.memo(props => {

    const src = 'http://localhost:8000' + props.video;
    const mainVideoFlg = (props.id === props.mainVideoId)

    const ref = useRef();

    const style = {
        width: '100%'
    }

    useEffect(() => {
        props.player.push(ref.current);
    }, [])

    /**
     *ビデオ読み込み後Durationセット（MAINVIDEOのみ）
     *
     * @param {videoElement}
     */
    const loadedMetadata = (target) => {
        props.setIsLoadingVideo(false);
        props.setMainVideoEle(target);
    }

    return(
        <>
            <video
                muted
                ref={ref}
                style={style}
                onLoadedMetadata={(mainVideoFlg) ? () => loadedMetadata(ref.current) : undefined} >
                <source src={src} />
            </video>
        </>
    )
});