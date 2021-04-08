import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import DeleteIcon from '../../images/delete.png'
import EditIcon from '../../images/edit.png'
import { deleteProject, updateTitle, updateDescription } from '../api/project'

import classes from  '../css/ProjectContent.module.css'

export const ProjectContent = (props) => {
    const [isEditTitle, setIsEditTitle] = useState(false);
    const [title, setTitle] = useState(props.title);

    const [isEditDescription, setIsEditDescription] = useState(false);
    const [description, setDescription] = useState(props.description);

    const history = useHistory();
    const handleClick = (id) => {
        history.push('/videorelationlist/' + id);
    }

    const handleDelete = (e) => {
        e.stopPropagation();
        alert('紐づく動画やタグも削除されます。\nよろしいですか？');
        deleteProject(props.id)
        .then(p => {
            var newProject = [...props.project];
            newProject = newProject.filter(np => np.id !== props.id);
            props.setProject(newProject);
        })
        .catch(e => {
            throw new Error(e);
        });
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
                var newProject = [...props.project];
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
                var newProject = [...props.project];
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

    const renderTitle = () => {
        return (isEditTitle)
            ? <input type='text' name='title' value={ title } autoFocus={ true } onChange={ (e) => setTitle(e.target.value) } onBlur={ (e) => handleBlur(props.id, e) } />
            : <p className={ classes.title }>{ title }</p>;
    }

    const renderDescription = () => {
        return (isEditDescription)
            ? <input type='text' name='description' value={ description } autoFocus={ true } onChange={ (e) => setDescription(e.target.value) } onBlur={ (e) => handleBlur(props.id, e) } />
            : <p className={ classes.description }>{ description }</p>;
    }

    return(
        <div className={ classes.project } onClick={ (!isEditTitle && !isEditDescription) ? () => handleClick(props.id) : undefined } >
            <h2>{props.id}</h2>
            <div>
                <div className={ classes.caption }>
                    <p>タイトル</p>
                    <img src={ EditIcon } alt='編集アイコン' className={ classes.img } onClick={ (e) => handleChangeTitle(e) } />
                </div>
                { renderTitle() }
            </div>
            <div>
                <div className={ classes.caption }>
                    <p>詳細</p>
                    <img src={ EditIcon } alt='編集アイコン' className={ classes.img } onClick={ (e) => handleChangeDescription(e) } />
                </div>
                { renderDescription() }
            </div>
            <img src={ DeleteIcon } alt='削除アイコン' className={ `${classes.img} ${classes.deleteIcon}`  } onClick={ (e) => handleDelete(e) } />
        </div>
    )
}