import React from 'react';
import * as THREE from 'three';

import classes from  '../css/TagElement.module.css'

export const TagElement = (props) => {

    const pointerEvent = (props.isMoveVideo) ? 'none' : 'auto';

    const mainCanvas = document.getElementsByTagName('canvas')[0];

    const style = (props.three_dimensional_flg)
        ? {
            width: props.tag.width + '%',
            height: props.tag.height + '%',
            top: (mainCanvas.height * (props.tag.top / 100)) + (THREE.Math.degToRad(props.lat - 90) * 500) + 'px',
            left: (mainCanvas.width * (props.tag.left / 100)) + (THREE.Math.degToRad(props.lon) * -500) + 'px',
            pointerEvents: pointerEvent,
        }
        : {
            width: props.tag.width + '%',
            height: props.tag.height + '%',
            top: props.tag.top + '%',
            left: props.tag.left + '%',
            pointerEvents: pointerEvent,
        }

    const handleClick = () => {
        switch(props.tag.action_type){
            case 'link':
                window.open(props.tag.url, '_blank');
                props.pauseVideo();
                break;
            case 'popup':
                props.displayPopup(props.tag);
                props.pauseVideo();
                break;
            case 'story':
                props.setStoryTransition([
                    ...props.storyTransition, 
                    {
                        videoRelationId: props.mainVideoRelationId,
                        videoId: props.mainVideoId,
                        currentFrame: props.currentFrame
                    }
                ]);
                props.setMainVideoRelationId(props.tag.story_next_video);
                props.setMainVideoId(Number(props.videoRelation.find(vr => vr.id === props.tag.story_next_video).videos[0].id));
                props.changeCurrentFrame(props.tag.story_start_frame);
                props.setIsStory(true);
            default:
                break;
        }
    }

    return (
        <div className={classes.tag} style={style} onClick={() => handleClick()}></div>
    )
}