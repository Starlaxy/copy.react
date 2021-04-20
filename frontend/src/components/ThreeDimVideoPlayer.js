import * as THREE from 'three'
import React, { useState, useEffect, useRef, Suspense } from 'react'
import { Canvas, useThree } from '@react-three/fiber'

// import classes from  '../css/VideoPlayer.module.css'

export const ThreeDimVideoPlayer = React.memo(props => {

    const style = {
        height: '600px'
    }

    const phi = THREE.Math.degToRad( 90 );
    const theta = THREE.Math.degToRad( 0 );

    const camPosition = [
        Math.sin( phi ) * Math.cos( theta ),
        Math.cos( phi ),
        Math.sin( phi ) * Math.sin( theta )
    ]
    
    return (
        <Canvas style={style} camera={{ fov: 75, position: camPosition, near: 1,far: 1200 }} linear={true}>
            <Suspense fallback={<>...Loading</>}>
                <Cube {...props} />
            </Suspense>
            <axesHelper args={[10]} />
        </Canvas>
        )
});

const Cube = React.memo(props => {

    const mesh = useRef();

    const mainVideoFlg = (props.id === props.mainVideoId);

    const [onPointerDownPointerX, setOnPointerDownPointerX] = useState(0);
    const [onPointerDownPointerY, setOnPointerDownPointerY] = useState(0);
    const [onPointerDownLon, setOnPointerDownLon] = useState(0);
    const [onPointerDownLat, setOnPointerDownLat] = useState(0);

    const [isPointerDown, setIsPointerDown] = useState(false);

    const [video] = useState(() => {
        const vid = document.createElement("video");
        vid.id = props.id;
        vid.src = 'http://localhost:8000' + props.video;
        vid.setAttribute( 'webkit-playsinline', 'webkit-playsinline' );
        vid.crossOrigin = "Anonymous";
        vid.addEventListener('loadedmetadata', () => {
            if(mainVideoFlg){
                props.setMainVideoId(Number(vid.id));
                props.setIsLoadingVideo(false);
                props.setMainVideoEle(vid);
                props.setTotalFrame(Math.ceil(vid.duration * props.fps));
            }
        })
        vid.addEventListener('ended', () => {
            props.setIsPlay(false);
        })
        return vid;
    })

    // コンポーネント作成時VideoElementを親要素に格納
    useEffect(() => {
        props.player.push(video);
    }, []);

    /**
     *動画角度変更時マウスダウンイベント
     * @param {PointerEvent} e
     */
    const pointerdown = (e) => {
        setIsPointerDown(true);
        props.setIsMoveVideo(true);
        setOnPointerDownPointerX(e.offsetX);
        setOnPointerDownPointerY(e.offsetY);
        setOnPointerDownLon(props.lon);
        setOnPointerDownLat(props.lat);
        e.target.setPointerCapture(e.pointerId);
    }

    /**
     *動画角度変更時マウスMOVEイベント
     * @param {PointerEvent} e
     */
    const pointerMove = (e) => {
        props.setLon(( e.offsetX - onPointerDownPointerX ) * -0.25 + onPointerDownLon);
        props.setLat(Math.max( 37.5, Math.min( 142.5, ( e.offsetY - onPointerDownPointerY ) * 0.25 + onPointerDownLat) ) );
        const phi = THREE.Math.degToRad( props.lat );
        const theta = THREE.Math.degToRad( props.lon );
        e.camera.position.x = Math.sin( phi ) * Math.cos( theta );
        e.camera.position.y = Math.cos( phi );
        e.camera.position.z = Math.sin( phi ) * Math.sin( theta );
        e.camera.lookAt( 0, 0, 0 );
    }

    /**
     *動画角度変更時マウスアップイベント
     * @param {PointerEvent} e
     */
    const pointerUp = (e) => {
        setIsPointerDown(false);
        props.setIsMoveVideo(false);
        e.target.releasePointerCapture(e.pointerId);
    }

    return (
        <mesh
            ref={mesh}
            scale={[1, 1, 1]}
            onPointerDown={(e) => pointerdown(e)}
            onPointerMove={(isPointerDown) ? (e) => pointerMove(e) : undefined}
            onPointerUp={(isPointerDown) ? (e) => pointerUp(e) : undefined} >
            <sphereBufferGeometry attach="geometry" args={[1000, 30, 30]} />
            <meshBasicMaterial side={THREE.BackSide} >
                <videoTexture attach="map" args={[video]} />
            </meshBasicMaterial>
        </mesh>
    )
})