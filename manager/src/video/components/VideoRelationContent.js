import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import DeleteIcon from '../../images/delete.png'
import EditIcon from '../../images/edit.png'
import { updateTitle, deleteVideoRelation } from '../api/video';
import { Confirm } from '../../common/components/Confirm'

import { getEncryptedString } from '../../common/components/Crypto'

import classes from  '../css/VideoRelationContent.module.css'

export const VideoRelationContent = (props) => {

    const [isEdit, setIsEdit] = useState(false);
    const [title, setTitle] = useState(props.title);

    const [isShowConfirmModal, setIsConfirmModal] = useState(false);

    const history = useHistory();

    const handleClick = () => {
        history.push(`/video/${getEncryptedString(props.id)}`)
    }

    const handleChange = (e) => {
        e.stopPropagation();
        setIsEdit(true);
    }

    const renderTitle = () => {
        return (isEdit)
            ? <input type='text' name='title' value={ title } autoFocus={ true } onChange={ (e) => setTitle(e.target.value) } onBlur={ () => handleBlur() } />
            : <p>{ title }</p>;
    }

    const handleBlur = () => {
        const data = { 'title': title };
        updateTitle(props.id, data)
        .then(vr => {
            // 親のState変更
            let newVideoRelation = [...props.videoRelation];
            newVideoRelation.find(nvr => nvr.id === vr.id).title = vr.title
            props.setVideoRelation(newVideoRelation);
        })
        .catch(e => {
            throw new Error(e);
        });
        // onClickが動いてしまうため時間差を作る
        setTimeout(() => {
            setIsEdit(false);
        }, 500);
    }

    /**
     *isShowConfirmModal true時にConfirmComponent表示
     * @return {JSX} ConfirmComponent
     */
    const renderConfirmModal = () => {
        if(isShowConfirmModal){
            const confirmTitle = `${title}削除`;
            const confirmDesc = `「${title}」に紐づくタグも削除されます。\nよろしいですか？`;
            return <Confirm title={confirmTitle} description={confirmDesc} confirmEvent={handleDelete} setIsConfirmModal={setIsConfirmModal} /> 
        }
    }

    /**
     *ConfirmComponent表示フラグTrue切り替え
     * @param {MouseEvent} e
     */
    const showConfirmModal = (e) => {
        e.stopPropagation();
        setIsConfirmModal(true);
    }

    const handleDelete = (e) => {
        deleteVideoRelation(props.id)
        .then(p => {
            let newVideoRelation = [...props.videoRelation];
            newVideoRelation = newVideoRelation.filter(nvr => nvr.id !== props.id);
            props.setVideoRelation(newVideoRelation);
            setIsConfirmModal(false);
        })
        .catch(e => {
            throw new Error(e);
        });
    }

    return(
        <>
            {renderConfirmModal()}
            <div onClick={ !isEdit ? () => handleClick() : undefined } className={classes.content}>
                <div className={classes.titleBox}>
                    { renderTitle() }
                    <img src={ EditIcon } alt='編集アイコン' className={ classes.editIcon } onClick={ (e) => handleChange(e) } />
                    <img src={ DeleteIcon } alt='削除アイコン' className={ classes.deleteIcon } onClick={ (e) => showConfirmModal(e) } />
                </div>
                <img className={classes.thumb} src={ "http://localhost:8000/videos/" + props.project + '/' + props.id + '/thumb/' + props.id + '.jpg'  } alt="サムネイル画像" />
            </div>
        </>
    )
}