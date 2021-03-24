import React from 'react';
import VideoPlayer from '../../components/VideoPlayer'

export const VideoContent = (video) => {

    const videoJsOptions = {
        autoplay: true,
        controls: true,
        sources: [{
            src: "http://localhost:8000" + video.video,
            type: 'video/mp4'
        }]
    }

    return(
        <>
            <h1>{video.id}</h1>
            <VideoPlayer options={videoJsOptions} />
        </>
    )
}