import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { getVideoRelation } from '../api/video'
import { VideoRelationContent } from '../components/VideoRelationContent';
import { VideoRelationForm } from '../components/VideoRelationForm';

import { getDecryptedString } from '../../common/components/Crypto'

// 画像import
import LoadingImg from '../../images/video/loading.gif'

import classes from  '../css/VideoRelationList.module.css'

export const VideoRelationList = () => {
    const initialState = {
        id: '',
        title: '',
    }

    const[videoRelation, setVideoRelation] = useState(initialState);
    const[loading, setLoading] = useState(true);
    const { projectId } = useParams();
    const decryptedProjectId = getDecryptedString(projectId)

    useEffect(() => {
        getVideoRelation(decryptedProjectId)
        .then(vr => {
            setVideoRelation(vr);
            setLoading(false);
        })
        .catch(e => {
            throw new Error(e);
        })
    },[])

    return(
        <>
            {
                loading ?
                <div className={classes.loadingLayer}>
                    <img src={LoadingImg} />
                    <p className={classes.loadingText}>Loading...</p>
                </div>
                :
                <div key='videoRelation' id="contents">
                    <div>
                        <h2 className={classes.title}>ビデオ一覧</h2>
                        <div className={classes.contentWrap}>
                            {videoRelation.map( vr => <VideoRelationContent key={ vr.id } {...vr} videoRelation={videoRelation} setVideoRelation={ setVideoRelation } /> )}
                        </div>
                        <VideoRelationForm projectId={ decryptedProjectId } setVideoRelation={ setVideoRelation } videoRelation={videoRelation} />
                    </div>
                </div>
            }
        </>
    )
}