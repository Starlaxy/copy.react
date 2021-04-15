import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { VideoPlayer } from '../components/VideoPlayer'

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

    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isLoadingVideo, setIsLoadingVideo] = useState(true);

    // VideoRelationに紐づくVideo、Tag情報取得
    useEffect(() => {
        getVideo(id)
        .then(v => {
            setVideo(v);
            setIsLoadingData(false);
        })
        .catch(e => {
            throw new Error(e);
        })
    }, []);

    const renderVideo = () => {
        return (
            video.map(v => (
                <VideoPlayer key={v.id} {...v} />
            ))
        )
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
                    {renderVideo()}
                </>
            }
        </>
    )
}