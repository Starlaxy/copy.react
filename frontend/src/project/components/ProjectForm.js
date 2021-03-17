import React, { useState, useEffect } from 'react';
import { createProject } from '../api/project'

export const ProjectForm = () => {

    const initialState = {
        title: '',
        description: '',
    }
    
    const [project, setProject] = useState(initialState);

    const handleChange = (event) => {
        const value = event.target.value;
        setProject({
            ...project,
            [event.target.name]: value
        });
    }

    const handleSubmit = (event) => {
        // ディクショナリー変換
        createProject(project)
        .then(p => {
            setProject(p);
        })
        .catch(e => {
            throw new Error(e);
        });
    }

    return(
        <form>
            <label>
                title:
                <input type="text" name="title" value={project.title} onChange={handleChange} />
            </label>
            <label>
                description:
                <input type="text" name="description" value={project.description} onChange={handleChange} />
            </label>
            <button onClick={handleSubmit}>送信</button>
        </form>
    )
}