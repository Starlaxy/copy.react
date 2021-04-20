import React, { useState } from 'react';
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

    const [isEditDescription, setIsEditDescription] = useState(false);
    const [description, setDescription] = useState(props.description);

    const [isShowConfirmModal, setIsConfirmModal] = useState(false);

    const history = useHistory();

    const handleClick = () => {
        history.push(`/videorelationlist/${getEncryptedString(props.id)}`);
    }

    const handleChangeTitle = (e) => {
        e.stopPropagation();
        setIsEditTitle(true);
    }

    const handleChangeDescription = (e) => {
        e.stopPropagation();
        setIsEditDescription(true);
    }

    const handleBlur = (id, e) => {
        if(e.target.name === 'title')
        {
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
        else if(e.target.name === 'description') {
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

    /**
     *isEditTitleに応じて詳細表示
     *true時：inputタグ
     *false時：pタグ
     * @return {JSX} 
     */
    const renderTitle = () => {
        return (isEditTitle)
            ? <input type='text' name='title' value={ title } autoFocus={ true } onChange={ (e) => setTitle(e.target.value) } onBlur={ (e) => handleBlur(props.id, e) } />
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
            ? <input type='text' name='description' value={ description } autoFocus={ true } onChange={ (e) => setDescription(e.target.value) } onBlur={ (e) => handleBlur(props.id, e) } />
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
                    </div>
                    <div className={classes.col}>
                        <div className={ classes.caption }>
                            <p>詳細</p>
                            <img src={ EditIcon } alt='編集アイコン' className={classes.editImg} onClick={ (e) => handleChangeDescription(e) } />
                        </div>
                        { renderDescription() }
                    </div>
                </div>
                <img src={ DeleteIcon } alt='削除アイコン' className={classes.deleteImg} onClick={ (e) => showConfirmModal(e) } />
            </div>
        </>
    )
}