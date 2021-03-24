import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import DeleteIcon from '../../images/delete.png'
import EditIcon from '../../images/edit.png'
import { deleteProject } from '../api/project'

export const ProjectContent = (props) => {

    const history = useHistory();

    const handleClick = (id) => {
        history.push("/videorelationlist/" + id)
    }

    const handleDelete = (id, e) => {
        e.stopPropagation();
        alert("紐づく動画やタグも削除されます。\nよろしいですか？")
        deleteProject(id)
        .then(p => {
            props.setProject(p);
        })
        .catch(e => {
            throw new Error(e);
        });
    }

    return(
        <div className="project" onClick={ () => handleClick(props.id) } >
            <h2>{props.id}</h2>
            <div className="title-wrap">
                <div className="caption">
                    <p>タイトル</p>
                    <img src={ EditIcon } alt="編集アイコン" />
                </div>
                <p className="title">{ props.title }</p>
            </div>
            <div className="desc-wrap">
                <div className="caption">
                    <p>詳細</p>
                    <img src={ EditIcon } />
                </div>
                <p className="description">{ props.description }</p>
            </div>
            <img src={ DeleteIcon } alt="削除アイコン" className="delete-icon" onClick={ (e) => handleDelete(props.id, e) } />
        </div>
    )
}