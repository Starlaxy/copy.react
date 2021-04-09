import React from 'react';

import classes from  '../css/TagElement.module.css'

export const TagElement = (props) => {

    const style = {
        width: props.tag.width + '%',
        height: props.tag.height + '%',
        top: props.tag.top + '%',
        left: props.tag.left + '%',
        pointerEvents: props.tag.pointerEvent,
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
                props.displayStoryLayer(props.tag);
            default:
                break;
        }
    }

    return (
        <div className={classes.tag} style={style} onClick={() => handleClick()}>{props.tag.title}</div>
    )
}