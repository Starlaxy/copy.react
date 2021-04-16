import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { VideoPlayer } from '../components/VideoPlayer'
import { VideoController } from '../components/VideoController'

import { initialVideoState } from '../components/InitialState'
import { getVideo } from '../api/video';

import { getDecryptedString } from '../components/Crypto'

// 画像import
import LoadingImg from '../images/loading.gif'

// デザインmodule
import classes from  '../css/Video.module.css'

export const Video = () => {

    const { id } = useParams();

    const [video, setVideo]= useState(initialVideoState);
    const [isPlay, setIsPlay] = useState(false);

    const [mainVideoId, setMainVideoId] = useState();
    const [player, setPlayer] = useState([]);
    const [mainVideoEle, setMainVideoEle] = useState(<video></video>);

    const [currentFrame, setCurrentFrame] = useState(0);

    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isLoadingVideo, setIsLoadingVideo] = useState(true);

    // VideoRelationに紐づくVideo、Tag情報取得
    useEffect(() => {
        getVideo(id)
        .then(v => {
            setVideo(v);
            setMainVideoId(v[0].id);
            setIsLoadingData(false);
        })
        .catch(e => {
            throw new Error(e);
        })
    }, []);

    const renderVideo = () => {
        return (
            video.map((v, index) => (
                <VideoPlayer
                    key={v.id}
                    {...v}
                    index={index}
                    setIsLoadingVideo={setIsLoadingVideo}
                    mainVideoId={mainVideoId}
                    setMainVideoEle={setMainVideoEle}
                    player={player} />
            ))
        )
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
                    {renderVideo()}
                    <VideoController
                        isPlay={isPlay}
                        mainVideoEle={mainVideoEle}
                        currentFrame={currentFrame}
                        setCurrentFrame={setCurrentFrame}
                        playVideo={playVideo}
                        pauseVideo={pauseVideo} />
                </>
            }
        </>
    )
}