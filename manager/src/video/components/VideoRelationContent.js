import React, { useState, useRef } from 'react';
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
    const [titleError, setTitleError] = useState('');
    const titleRef = useRef();

    const [isShowConfirmModal, setIsConfirmModal] = useState(false);

    const history = useHistory();

    /**
     *VideoRelationクリック時ページ遷移
     */
    const handleClick = () => {
        history.push(`/video/${getEncryptedString(props.id)}`)
    }

    /**
     *編集ボタン押下イベント（編集フラグをTrueに）
     * @param {*} e
     */
    const handleChange = (e) => {
        e.stopPropagation();
        setIsEdit(true);
    }

    /**
     *修正Flgに応じてpタグ、inputタグ出し分け
     * @return {JSX} p/input 
     */
    const renderTitle = () => {
        return (isEdit)
            ? <input
                type='text'
                name='title'
                ref={titleRef}
                value={ title }
                autoFocus={ true }
                onChange={ (e) => setTitle(e.target.value) }
                onBlur={ () => handleBlur() }
                className={(titleError !== '') ? classes.error : undefined} />
            : <p>{ title }</p>;
    }

    /**
     *Blur時に非同期通信で変更
     */
    const handleBlur = () => {
        const error = titleValidation(title);
        if(error){
            setTitleError(error);
            titleRef.current.focus();
        }
        else{
            setTitleError('');
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
    }

    /**
     *エラーがあればタイトルのエラーメッセージ描画
     * @return {JSX} titleError
     */
    const renderTitleError = () => {
        if(titleError){
            return <span className={classes.errorMessage}>{titleError}</span>
        }
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

    /**
     *VideoRelation削除イベント
     *削除後全体の要素から該当VideoRelationを削除し、State更新
     * @param {MouseEvent} e
     */
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

    /**
     *タイトル入力チェック
     * @param {string} title
     * @return {string} ErrorMessage 
     */
    const titleValidation = (title) => {
        if(!title){
            return '入力必須項目です';
        }
        else if(100 < title.length){
            return '100文字以下で入力してください'
        }
        return '';
    }

    return(
        <>
            {renderConfirmModal()}
            <div onClick={ !isEdit ? () => handleClick() : undefined } className={classes.content}>
                <div className={classes.titleWrap}>
                    {renderTitleError()}
                    <div className={classes.titleBox}>
                        { renderTitle() }
                        <img src={ EditIcon } alt='編集アイコン' className={ classes.editIcon } onClick={ (e) => handleChange(e) } />
                        <img src={ DeleteIcon } alt='削除アイコン' className={ classes.deleteIcon } onClick={ (e) => showConfirmModal(e) } />
                    </div>
                </div>
                <img className={classes.thumb} src={ "http://localhost:8000/videos/" + props.project + '/' + props.id + '/thumb/' + props.id + '.jpg'  } alt="サムネイル画像" />
            </div>
        </>
    )
}