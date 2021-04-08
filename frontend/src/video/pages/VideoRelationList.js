import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { getVideoRelation } from '../api/video'
import { VideoRelationContent } from '../components/VideoRelationContent';
import { VideoRelationForm } from '../components/VideoRelationForm';

import classes from  '../css/VideoRelationList.module.css'

export const VideoRelationList = () => {
    const initialState = {
        id: '',
        title: '',
    }

    const[videoRelation, setVideoRelation] = useState(initialState);
    const[loading, setLoading] = useState(true);
    const { projectId } = useParams();

    useEffect(() => {
        getVideoRelation(projectId)
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
                <div key='loading'>
                    <p>loading...</p>
                </div>
                :
                <div key='videoRelation' id="contents">
                    <div>
                        <h2 className={classes.title}>ビデオ一覧</h2>
                        <div className={classes.contentWrap}>
                            {videoRelation.map( vr => <VideoRelationContent key={ vr.id } {...vr} videoRelation={videoRelation} setVideoRelation={ setVideoRelation } /> )}
                        </div>
                        <VideoRelationForm projectId={ projectId } setVideoRelation={ setVideoRelation } videoRelation={videoRelation} />
                    </div>
                </div>
            }
        </>
    )
}