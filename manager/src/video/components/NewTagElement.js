import React from 'react';
import * as THREE from 'three'

import classes from  '../css/NewTagElement.module.css'

export const NewTagElement = (props) => {

    const mainCanvas = document.getElementsByTagName('canvas')[0];

    const style = (props.three_dimensional_flg)
        ? {
            width: props.width + '%',
            height: props.height + '%',
            top: (mainCanvas.height * (props.top / 100)) + (THREE.Math.degToRad(props.lat - 90) * 500) + 'px',
            left: (mainCanvas.width * (props.left / 100)) + (THREE.Math.degToRad(props.lon) * -500) + 'px',
            pointerEvents: props.pointerEvent,
        }
        : {
            width: props.width + '%',
            height: props.height + '%',
            top: props.top + '%',
            left: props.left + '%',
            pointerEvents: props.pointerEvent,
        }

    const handleClick = () => {
        switch(props.action_type){
            case 'link':
                window.open(props.url, '_blank');
                break;
            case 'popup':
                props.displayPopup();
                break;
            case 'story':
                props.displayStoryLayer();
                break;

            default:
                break;
        }
    }

    return (
        <div className={classes.tag} style={style} onClick={() => handleClick()}>{props.title}</div>
    )
}