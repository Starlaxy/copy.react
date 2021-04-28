import * as THREE from 'three'
import React, { useState, useEffect, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'

// import classes from  '../css/VideoPlayer.module.css'

export const ThreeDimVideoPlayer = React.memo(props => {

    const phi = THREE.Math.degToRad( 90 );
    const theta = THREE.Math.degToRad( 0 );

    const camPosition = [
        Math.sin( phi ) * Math.cos( theta ),
        Math.cos( phi ),
        Math.sin( phi ) * Math.sin( theta )
    ]

    const mainVideoFlg = (props.id === props.mainVideoId);

    const pointerEvent = (props.isCreatingTag) ? 'none' : 'auto';

    const style = 
        (mainVideoFlg)
            ? {
                width: '100%',
                height: '100%',
            }
            : {
                width: '200px',
                height: '100px',
                position: 'absolute',
                bottom: '20px',
                right: ((props.index - 1) * 200) + 20 + 'px',
                zIndex: 1,
                pointerEvents: pointerEvent
            };
    
    return (
        <>
            <Canvas style={style} camera={{ fov: 75, position: camPosition, near: 1, far: 1200 }} linear={true}>
                <Cube {...props} />
                <axesHelper args={[10]} />
            </Canvas>
        </>
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

    const { size } = useThree();

    const [video] = useState(() => {
        const vid = document.createElement("video");
        vid.id = props.id;
        vid.src = 'http://localhost:8000' + props.video;
        vid.setAttribute( 'webkit-playsinline', 'webkit-playsinline' );
        vid.crossOrigin = "Anonymous";
        vid.addEventListener('loadedmetadata', () => {
            if(mainVideoFlg){
                props.setMainVideoId(Number(vid.id));
                props.setMainVideoEle(vid);
                props.setIsLoadingVideo(false);
            }
        })
        vid.addEventListener('ended', () => {
            props.setIsPlay(false);
        })
        return vid;
    })

    useEffect(() => {
        props.player.push(video);
    }, [video]);

    /**
     *動画角度変更時マウスダウンイベント
     * @param {PointerEvent} e
     */
    const pointerdown = (e) => {
        setOnPointerDownPointerX(e.offsetX);
        setOnPointerDownPointerY(e.offsetY);
        setOnPointerDownLon(props.lon);
        setOnPointerDownLat(props.lat);
        props.setCanMove(true);
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
        props.setCanMove(false);
        e.target.releasePointerCapture(e.pointerId);
    }

    /**
     *領域指定ボタン押下後のマウスダウンイベント
     *タグの大きさ、場所を設定
     * @param {PointerEvent} e
     */
    const createTagPointerDown = (e) => {
        setIsPointerDown(true);
        props.setCreatingTagState({
            ...props.creatingTagState,
            startX: e.offsetX,
            startY: e.offsetY,
        });
        e.target.setPointerCapture(e.pointerId);
    };

    /**
     *タグ作成時、PointerDOWN後のPointerMOVEイベント
     * @param {PointerEvent} e
     */
    const createTagPointerMove = (e) => {
        // px単位で管理するとwindowサイズにより、相違が生まれるため％で管理
        const adjustmentLeft = Math.max(0, Math.min(props.creatingTagState.startX, e.offsetX));
        const adjustmentTop = Math.max(0, Math.min(props.creatingTagState.startY, e.offsetY));
        const adjustmentRight = Math.min(size.width, Math.max(props.creatingTagState.startX, e.offsetX));
        const adjustmentBottom = Math.min(size.height, Math.max(props.creatingTagState.startY, e.offsetY));
        const width = (adjustmentRight - adjustmentLeft) / size.width * 100;
        const height = (adjustmentBottom - adjustmentTop) / size.height * 100;
        const left = (adjustmentLeft + (THREE.Math.degToRad(props.lon) * 500)) / size.width * 100;
        const top = (adjustmentTop - (THREE.Math.degToRad(props.lat - 90) * 500)) / size.height * 100;
        // 既存のタグ修正時
        if(props.creatingTagState.id !== -1){
            const newVideo = [...props.all_video];
            newVideo.map(nv => (
                nv.tags.forEach(nt => {
                    if(nt.id === props.creatingTagState.id){
                        // 5桁以下で管理したいため、*100/100
                        nt.width = Math.floor(width * 100) / 100;
                        nt.height = Math.floor(height * 100) / 100;
                        nt.left = Math.floor(left * 100) / 100;
                        nt.top = Math.floor(top * 100) / 100;
                    }
                })
            ));
            props.setVideo(newVideo);
        }
        // 新規タグ作成
        else {
            props.setNewTagEleState({
                ...props.newTagEleState,
                width: Math.floor(width * 100) / 100,
                height: Math.floor(height * 100) / 100,
                left: Math.floor(left * 100) / 100,
                top: Math.floor(top * 100) / 100,
            });
        }
    }

    /**
     *領域指定ボタン押下後のマウスアップイベント
     *タグの大きさ、場所を設定(%)
     * @param {PointerEvent} e
     */
    const createTagPointerUp = (e) => {
        props.setIsCreatingTag(false);
        setIsPointerDown(false);
        e.target.releasePointerCapture(e.pointerId);
    }

    /**
     *サブ動画クリックイベント(Swiching機能)
     * @param {VideoElement}
     */
    const changeVideo = () => {
        props.setMainVideoId(props.id);
        props.setMainVideoEle(video);
    }

    return (
        <mesh
            ref={mesh}
            scale={[1, 1, 1]}
            onPointerDown={(props.isCreatingTag) ? (e) => createTagPointerDown(e) : (mainVideoFlg) ? (e) => pointerdown(e) : undefined}
            onPointerMove={(props.canMove) ? (e) => pointerMove(e) : (isPointerDown) ? (e) => createTagPointerMove(e) : undefined}
            onPointerUp={(props.canMove) ? (e) => pointerUp(e) : (isPointerDown) ? (e) => createTagPointerUp(e) : undefined}
            onClick={(mainVideoFlg) ? undefined : () => changeVideo()} >
            <sphereBufferGeometry attach="geometry" args={[1000, 30, 30]} />
            <meshBasicMaterial side={THREE.BackSide} >
                <videoTexture attach="map" args={[video]} />
            </meshBasicMaterial>
        </mesh>
    )
})