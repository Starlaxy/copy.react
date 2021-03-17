import React from 'react';
import DeleteIcon from '../../images/delete.png'
import EditIcon from '../../images/edit.png'

export const ProjectContent = (project) => {
    return(
        <div className="project">
            <div className="title-wrap">
                <div className="caption">
                    <p>タイトル</p>
                    <img src={ EditIcon } />
                </div>
                <p className="title">{ project.title }</p>
            </div>
            <div className="desc-wrap">
                <div className="caption">
                    <p>詳細</p>
                    <img src={ EditIcon } />
                </div>
                <p className="description">{ project.description }</p>
            </div>
            <img src={ DeleteIcon } alt="削除アイコン" className="delete-icon" />
        </div>
    )
}