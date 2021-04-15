import React, { useState, useEffect } from 'react'
import { getProject } from '../api/project'
import { ProjectContent } from '../components/ProjectContent';
import { ProjectForm } from '../components/ProjectForm';

// 画像import
import LoadingImg from '../../images/video/loading.gif'

import classes from  '../css/ProjectList.module.css'

export const ProjectList = () => {
    const initialState = {
        id: '',
        title: '',
        description: '',
        created_at: '',
    }

    const[project, setProject] = useState([initialState]);
    const[loading, setLoading] = useState(true);

    useEffect(() => {
        getProject()
        .then(p => {
            setProject(p);
            setLoading(false);
        })
        .catch(e => {
            throw new Error(e);
        })
    },[])

    return(
        <>
            {
                loading ?
                <div className={classes.loadingLayer}>
                    <img src={LoadingImg} />
                    <p className={classes.loadingText}>Loading...</p>
                </div>
                :
                <div>
                    <h2 className={ classes.h2 }>プロジェクト一覧</h2>
                    {project.map( p => <ProjectContent {...p} setProject={ setProject } project={project} key={p.id} /> )}
                    <ProjectForm setProject={ setProject } project={project} />
                </div>
            }
        </>
    )

}