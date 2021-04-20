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
                    <div className={classes.displayFormBtnWrap} style={transitionStyle[state]} onClick={ (e) => handleDisplay(e) }>
                        <p className={classes.displayFormBtn}>{ mount ? '閉じる' : '追加' }</p>
                    </div>
                    <form className={classes.addForm} style={transitionStyle[state]}>
                        <div className={classes.inputCol}>
                            <label>タイトル</label>
                            <input type='text' name='title' value={project.title} onChange={handleChange} />
                        </div>
                        <div className={classes.inputCol}>
                            <label>詳細</label>
                            <input type='text' name='description' value={project.description} onChange={handleChange} />
                        </div>
                        <div className={classes.submitBtnWrap}>
                            <button onClick={handleSubmit} className={classes.submitBtn}>送信</button>
                        </div>
                    </form>
                </div>
            }
        </Transition>
    )
}