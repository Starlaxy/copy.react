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
        <Canvas id="hoge" style={style} camera={{ fov: 75, position: camPosition, near: 1,far: 1200 }} linear={true}>
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

    const [onMouseDownMouseX, setOnMouseDownMouseX] = useState(0);
    const [onMouseDownMouseY, setOnMouseDownMouseY] = useState(0);
    const [onMouseDownLon, setOnMouseDownLon] = useState(0);
    const [onMouseDownLat, setOnMouseDownLat] = useState(0);

    const [isMouseDown, setIsMouseDown] = useState(false);

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
        return vid;
    })

    useEffect(() => {
        props.player.push(video);
    }, []);

    /**
     *動画角度変更時マウスダウンイベント
     * @param {MouseEvent} e
     */
    const mousedown = (e) => {
        setOnMouseDownMouseX(e.offsetX);
        setOnMouseDownMouseY(e.offsetY);
        setOnMouseDownLon(props.lon);
        setOnMouseDownLat(props.lat);
        props.setCanMove(true);
    }

    /**
     *動画角度変更時マウスMOVEイベント
     * @param {MouseEvent} e
     */
    const mouseMove = (e) => {
        props.setLon(( e.offsetX - onMouseDownMouseX ) * -0.25 + onMouseDownLon);
        props.setLat(Math.max( 37.5, Math.min( 142.5, ( e.offsetY - onMouseDownMouseY ) * 0.25 + onMouseDownLat) ) );
        const phi = THREE.Math.degToRad( props.lat );
        const theta = THREE.Math.degToRad( props.lon );
        e.camera.position.x = Math.sin( phi ) * Math.cos( theta );
        e.camera.position.y = Math.cos( phi );
        e.camera.position.z = Math.sin( phi ) * Math.sin( theta );
        e.camera.lookAt( 0, 0, 0 );
    }

    /**
     *動画角度変更時マウスアップイベント
     * @param {MouseEvent} e
     */
    const mouseUp = (e) => {
        props.setCanMove(false);
    }

    /**
     *領域指定ボタン押下後のマウスダウンイベント
     *タグの大きさ、場所を設定
     * @param {MouseEvent} e
     */
    const createTagMouseDown = (e) => {
        setIsMouseDown(true);
        props.setCreatingTagState({
            ...props.creatingTagState,
            startX: e.offsetX,
            startY: e.offsetY,
        });
    };

    /**
     *タグ作成時、MOUSEDOWN後のMOUSEMOVEイベント
     * @param {MouseEvent} e
     */
    const createTagMouseMove = (e) => {
        // px単位で管理するとwindowサイズにより、相違が生まれるため％で管理
        const width = (Math.max(e.offsetX, props.creatingTagState.startX) - Math.min(e.offsetX, props.creatingTagState.startX)) / size.width * 100;
        const height = (Math.max(e.offsetY, props.creatingTagState.startY) - Math.min(e.offsetY, props.creatingTagState.startY)) / size.height * 100;
        const left = Math.min(props.creatingTagState.startX, e.offsetX) / size.width * 100;
        const top = Math.min(props.creatingTagState.startY, e.offsetY) / size.height * 100;
        // 既存のタグ修正時
        if(props.creatingTagState.id !== -1){
            const newVideo = [...props.all_video];
            newVideo.map(nv => {
                nv.tags.map(nt => {
                    if(nt.id === props.creatingTagState.id){
                        // 5桁以下で管理したいため、*100/100
                        nt.width = Math.floor(width * 100) / 100;
                        nt.height = Math.floor(height * 100) / 100;
                        nt.left = Math.floor(left * 100) / 100;
                        nt.top = Math.floor(top * 100) / 100;
                    }
                });
            });
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
     * @param {MouseEvent} e
     */
    const createTagMouseUp = (e) => {
        props.setIsCreatingTag(false);
        setIsMouseDown(false);
    }

    return (
        <mesh
            ref={mesh}
            scale={[1, 1, 1]}
            onPointerDown={(props.isCreatingTag) ? (e) => createTagMouseDown(e) : (e) => mousedown(e)}
            onPointerMove={(props.canMove) ? (e) => mouseMove(e) : (isMouseDown) ? (e) => createTagMouseMove(e) : undefined}
            onPointerUp={(props.canMove) ? (e) => mouseUp(e) : (isMouseDown) ? (e) => createTagMouseUp(e) : undefined} >
            <sphereBufferGeometry attach="geometry" args={[1000, 30, 30]} />
            <meshBasicMaterial side={THREE.BackSide} >
                <videoTexture attach="map" args={[video]} />
            </meshBasicMaterial>
        </mesh>
    )
})