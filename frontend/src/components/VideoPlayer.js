import React, { useState, useRef, useEffect } from "react"

// import classes from  '../css/VideoPlayer.module.css'

export const VideoPlayer = React.memo(props => {

    const src = 'http://localhost:8000' + props.video;

    return(
        <>
            <video muted >
                <source src={src} />
            </video>
        </>
    )
});