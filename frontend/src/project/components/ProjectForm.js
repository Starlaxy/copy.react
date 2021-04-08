import React, { useState, useRef } from 'react';
import { createProject } from '../api/project'
import { Transition } from 'react-transition-group';

import classes from  '../css/ProjectForm.module.css'

export const ProjectForm = (props) => {

    const nodeRef = useRef();

    const initialState = {
        title: '',
        description: '',
    }
    
    const [project, setProject] = useState(initialState);

    const [mount, setMount] = useState(false);
    const transitionStyle = {
        entering: {
            transition: 'all 0.5s ease',
            transform: 'translateX(-400px) ',
        },
        entered: {
            transition: 'all 0.5s ease',
            transform: 'translateX(-400px) ',
        },
        exiting: {
            transition: 'all 0.5s ease',
            transform: 'translateX(0)',
        },
        exited: {
            transition: 'all 0.5s ease',
            transform: 'translateX(0)',
        },
    };

    const handleDisplay = (e) => {
        e.preventDefault();
        setMount(!mount);
    }

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
            props.setProject([...props.project, p]);
            setProject(initialState);
        })
        .catch(e => {
            throw new Error(e);
        });
    }

    return(
        <Transition nodeRef={nodeRef} in={mount} timeout={1000} >
            {(state) =>
                <div ref={nodeRef}>
                    <button className={classes.displayFormBtn} onClick={ (e) => handleDisplay(e) } style={transitionStyle[state]}>{ mount ? '閉じる' : '追加' }</button>
                    <form className={classes.addForm} style={transitionStyle[state]}>
                        <label>
                            title:
                            <input type='text' name='title' value={project.title} onChange={handleChange} />
                        </label>
                        <label>
                            description:
                            <input type='text' name='description' value={project.description} onChange={handleChange} />
                        </label>
                        <button onClick={handleSubmit}>送信</button>
                    </form>
                </div>
            }
        </Transition>
    )
}