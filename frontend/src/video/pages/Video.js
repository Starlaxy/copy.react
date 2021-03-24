import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { getVideo } from '../api/video'
import { VideoContent } from '../components/VideoContent';

export const Video = () => {
    const initialState = {
        id: '',
        title: '',
        video: null
    }

    const[video, setVideo] = useState(initialState);
    const[loading, setLoading] = useState(true);
    const { videoRelationId } = useParams();

    useEffect(() => {
        getVideo(videoRelationId)
        .then(v => {
            setVideo(v);
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
                <div key='video' id="contents">
                    {video.map( v => <VideoContent {...v} key={ v.id }  /> )}
                </div>
            }
        </>
    )

}