import React, { useState } from 'react';
import { createProject } from '../api/project'

export const ProjectForm = (props) => {

    const initialState = {
        title: '',
        description: '',
    }
    
    const [project, setProject] = useState(initialState);

    const handleChange = (e) => {
        const value = e.target.value;
        setProject({
            ...project,
            [e.target.name]: value
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        createProject(project)
        .then(p => {
            props.setProject(p);
            setProject(initialState);
        })
        .catch(e => {
            throw new Error(e);
        });
    }

    const handleEdit = (e) => {
        
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