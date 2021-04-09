import React from 'react';

import classes from  '../css/NewTagElement.module.css'

export const NewTagElement = (props) => {

    const pointerEvent = (props.isCreatingTag) ? 'none' : 'auto';

    const style = {
        width: props.width + '%',
        height: props.height + '%',
        top: props.top + '%',
        left: props.left + '%',
        pointerEvents: pointerEvent,
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
                console.log(props.action_type);
                break;

            default:
                break;
        }
    }

    return (
        <div className={classes.tag} style={style} onClick={() => handleClick()}>{props.title}</div>
    )
}