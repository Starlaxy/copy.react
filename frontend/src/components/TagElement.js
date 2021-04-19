import React from 'react';

import { getVideo } from '../api/video';

import classes from  '../css/TagElement.module.css'

export const TagElement = (props) => {

    const style = {
            width: props.tag.width + '%',
            height: props.tag.height + '%',
            top: props.tag.top + '%',
            left: props.tag.left + '%',
        }

    const handleClick = () => {
        switch(props.tag.action_type){
            case 'link':
                window.open(props.tag.url, '_blank');
                props.pauseVideo();
                break;
            case 'popup':
                props.displayPopup(props.tag);
                break;
            case 'story':
                props.setMainVideoRelationId(props.tag.story_next_video);
                props.setMainVideoId(Number(props.videoRelation.find(vr => vr.id === props.tag.story_next_video).videos[0].id));
                props.changeCurrentFrame(props.tag.story_start_frame);
            default:
                break;
        }
    }

    return (
        <div className={classes.tag} style={style} onClick={() => handleClick()}></div>
    )
}