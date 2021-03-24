import React from 'react';
import { useHistory } from 'react-router-dom';

export const VideoRelationContent = (videoRelation) => {

    const history = useHistory();

    const handleClick = (id) => {
        history.push("/video/" + id)
    }

    return(
        <div className="video-all" onClick={ () => handleClick(videoRelation.id) }>
            <p>{ videoRelation.title }</p>
        </div>
    )
}