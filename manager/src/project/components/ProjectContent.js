import React, { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import DeleteIcon from '../../images/delete.png'
import EditIcon from '../../images/edit.png'
import { deleteProject, updateTitle, updateDescription } from '../api/project'
import { Confirm } from '../../common/components/Confirm'

import { getEncryptedString } from '../../common/components/Crypto'

import classes from  '../css/ProjectContent.module.css'

export const ProjectContent = (props) => {
    const [isEditTitle, setIsEditTitle] = useState(false);
    const [title, setTitle] = useState(props.title);
    const [titleError, setTitleError] = useState('');
    const titleRef = useRef();

    const [isEditDescription, setIsEditDescription] = useState(false);
    const [description, setDescription] = useState(props.description);
    const [descriptionError, setDescriptionError] = useState('');
    const descRef = useRef();

    const [isShowConfirmModal, setIsConfirmModal] = useState(false);

    const history = useHistory();

    const handleClick = () => {
        history.push(`/videorelationlist/${getEncryptedString(props.id)}`);
    }

    /**
     *タイトル編集ボタン押下時Title変更フラグ変更
     * @param {MouseEvent} e
     */
    const handleChangeTitle = (e) => {
        e.stopPropagation();
        setIsEditTitle(true);
    }

    /**
     *詳細編集ボタン押下時Description変更フラグ変更
     * @param {MouseEvent} e
     */
    const handleChangeDescription = (e) => {
        e.stopPropagation();
        setIsEditDescription(true);
    }

    /**
     *Blur時に非同期通信で変更
     *
     * @param {*} id
     * @param {*} e
     */
    const handleBlur = (id, e) => {
        if(e.target.name === 'title')
        {
            const error = titleValidation(title);
            if(error){
                setTitleError(error);
                titleRef.current.focus();
            } 
            else {
                setTitleError('');
                const data = { 'title': title };
                updateTitle(id, data)
                .then(p => {
                    // 親のProjectState変更
                    let newProject = [...props.project];
                    newProject.find(np => np.id === p.id).title = p.title
                    props.setProject(newProject);
                })
                .catch(e => {
                    throw new Error(e);
                });
                // projectのonClickが動いてしまうため時間差を作る
                setTimeout(() => {
                    setIsEditTitle(false);
                }, 500);
            }
        }
        else if(e.target.name === 'description') {
            const error = descValidation(description);
            if(error){
                setDescriptionError(error);
                descRef.current.focus();
            }
            else {
                setDescriptionError('')
                const data = { 'description': description };
                updateDescription(id, data)
                .then(p => {
                    // 親のProjectState変更
                    let newProject = [...props.project];
                    newProject.find(np => np.id === p.id).description = p.description
                    props.setProject(newProject);
                })
                .catch(e => {
                    throw new Error(e);
                });
                // projectのonClickが動いてしまうため時間差を作る
                setTimeout(() => {
                    setIsEditDescription(false);
                }, 500)
            }
        }
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

    /**
     *詳細入力チェック
     * @param {string} description
     * @return {string} ErrorMessage
     */
    const descValidation = (description) => {
        if(!description){
            return '入力必須項目です';
        }
        return '';
    }

    /**
     *isEditTitleに応じて詳細表示
     *true時：inputタグ
     *false時：pタグ
     * @return {JSX} 
     */
    const renderTitle = () => {
        return (isEditTitle)
            ? <input
                ref={titleRef}
                type='text'
                name='title'
                value={ title }
                autoFocus={ true }
                onChange={ (e) => setTitle(e.target.value) }
                onBlur={ (e) => handleBlur(props.id, e) }
                className={(titleError !== '') ? classes.error : undefined} />
            : <p className={ classes.title }>{ title }</p>;
    }

    /**
     *isEditDescriptionに応じて詳細表示
     *true時：inputタグ
     *false時：pタグ
     * @return {JSX} 
     */
    const renderDescription = () => {
        return (isEditDescription)
            ? <input
                ref={descRef}
                type='text'
                name='description'
                value={ description }
                autoFocus={ true }
                onChange={ (e) => setDescription(e.target.value) }
                onBlur={ (e) => handleBlur(props.id, e) }
                className={(descriptionError !== '') ? classes.error : undefined} />
            : <p className={ classes.description }>{ description }</p>;
    }

    /**
     *isShowConfirmModal true時にConfirmComponent表示
     * @return {JSX} ConfirmComponent
     */
    const renderConfirmModal = () => {
        if(isShowConfirmModal){
            const confirmTitle = `${title}削除`;
            const confirmDesc = `「${title}」に紐づく動画やタグも削除されます。\nよろしいですか？`;
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
     *プロジェクト削除
     * @param {MouseEvent} e
     */
     const handleDelete = (e) => {
        deleteProject(props.id)
        .then(p => {
            let newProject = [...props.project];
            newProject = newProject.filter(np => np.id !== props.id);
            props.setProject(newProject);
            setIsConfirmModal(false);
        })
        .catch(e => {
            throw new Error(e);
        });
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
     *エラーがあれば詳細のエラーメッセージ描画
     * @return {JSX} desctiptionError
     */
    const renderDescError = () => {
        if(descriptionError){
            return <span className={classes.errorMessage}>{descriptionError}</span>
        }
    }

    return(
        <>
            {renderConfirmModal()}
            <div className={ classes.project } onClick={ (!isEditTitle && !isEditDescription) ? () => handleClick() : undefined } >
                <div>
                    <div className={classes.col}>
                        <div className={ classes.caption }>
                            <p>タイトル</p>
                            <img src={ EditIcon } alt='編集アイコン' className={classes.editImg} onClick={ (e) => handleChangeTitle(e) } />
                        </div>
                        { renderTitle() }
                        {renderTitleError()}
                    </div>
                    <div className={classes.col}>
                        <div className={ classes.caption }>
                            <p>詳細</p>
                            <img src={ EditIcon } alt='編集アイコン' className={classes.editImg} onClick={ (e) => handleChangeDescription(e) } />
                        </div>
                        { renderDescription() }
                        {renderDescError()}
                    </div>
                </div>
                <img src={ DeleteIcon } alt='削除アイコン' className={classes.deleteImg} onClick={ (e) => showConfirmModal(e) } />
            </div>
        </>
    )
}