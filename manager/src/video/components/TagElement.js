import React from 'react';
import * as THREE from 'three'

import classes from  '../css/TagElement.module.css'

export const TagElement = (props) => {

    const mainCanvas = document.getElementsByTagName('canvas')[0];

    const style = (props.three_dimensional_flg)
        ? {
            width: props.tag.width + '%',
            height: props.tag.height + '%',
            top: (mainCanvas.height * (props.tag.top / 100)) + (THREE.Math.degToRad(props.lat - 90) * 500) + 'px',
            left: (mainCanvas.width * (props.tag.left / 100)) + (THREE.Math.degToRad(props.lon) * -500) + 'px',
            pointerEvents: props.pointerEvent,
        }
        : {
            width: props.tag.width + '%',
            height: props.tag.height + '%',
            top: props.tag.top + '%',
            left: props.tag.left + '%',
            pointerEvents: props.pointerEvent,
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
            
            // no default
        }
    }

    return (
        <div className={classes.tag} style={style} onClick={() => handleClick()}>{props.tag.title}</div>
    )
}