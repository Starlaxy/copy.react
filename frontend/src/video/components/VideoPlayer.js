import React, { useRef, useEffect } from "react"

import classes from  '../css/VideoPlayer.module.css'

export const VideoPlayer = React.memo(props => {

    const ref = useRef();

    useEffect(() => {
        props.player.push(ref.current);
    }, []);

    const src = 'http://localhost:8000' + props.video;

    const style = (props.mainVideoFlg) ? { width: '100%' } : undefined;

    /**
     *ビデオ読み込み後Durationセット（MAINVIDEOのみ）
     *
     * @param {videoElement}
     */
    const loadedMetadata = (target) => {
        if(props.mainVideoFlg){
            props.setMainVideo(target);
        }
    }

    /**
     *動画終了時イベント
     */
    const onEnded = () => {
        if(props.mainVideoFlg){
            props.setIsPlay(false);   
        }
    }

    /**
     *サブ動画クリックイベント(Swiching機能)
     * @param {VideoElement}
     */
    const changeVideo = (targetEle) => {
        if(!props.mainVideoFlg){
            console.log('hogehoge')
            const newVideo = [...props.all_video];

            const target = newVideo.find(nv => String(nv.id) === targetEle.id);
            newVideo.forEach((nv, index) => {
                if(nv => String(nv.id) === target.id){
                    newVideo[index] = newVideo.find(nv => String(nv.id) === props.mainVideo.id);
                }
            });
            newVideo[0] = target;
            props.setVideo(newVideo);
            props.setMainVideo(targetEle);
        }
    }

    return(
        <>
            <video muted
                id={props.id}
                className={classes.video}
                style={style}
                ref={ref}
                onLoadedMetadata={() => loadedMetadata(ref.current)}
                onEnded={() => onEnded()}
                onClick={() => changeVideo(ref.current)}
                onMouseDown={(props.createTagMouseDown !== undefined) ? (e) => props.createTagMouseDown(e) : undefined}
                onMouseMove={(props.createTagMouseMove !== undefined) ? (e) => props.createTagMouseMove(e) : undefined}
                onMouseUp={(props.createTagMouseUp !== undefined) ? (e) => props.createTagMouseUp(e): undefined} >
                <source src={src} />
            </video>
        </>
    )
});