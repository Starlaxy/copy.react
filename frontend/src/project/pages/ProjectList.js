import React, { useState, useEffect } from 'react'
import { getProject } from '../api/project'
import { ProjectContent } from '../components/ProjectContent';
import { ProjectForm } from '../components/ProjectForm';
import '../css/project.css'

export const ProjectList = () => {
    const initialState = {
        id: '',
        title: '',
        description: '',
        created_at: '',
    }

    const[project, setProject] = useState(initialState);
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
                <div key='loading'>
                    <p>loading...</p>
                </div>
                :
                <div key='project' id="contents">
                    <div>
                        <h2>プロジェクト一覧</h2>
                        {project.map( p => <ProjectContent {...p}  /> )}
                        <ProjectForm />
                    </div>
                </div>
            }
        </>
    )

}