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
    const [projectErrors, setProjectErrors] = useState(initialState);

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
        if(Object.values(project).every(v => v !== '')){
            props.setLoading(true);
            createProject(project)
            .then(p => {
                props.setProject([...props.project, p]);
                setProject(initialState);
                props.setLoading(false);
            })
            .catch(e => {
                throw new Error(e);
            });
        }
        else {
            setProjectErrors({
                title: titleValidation(project.title),
                description: descValidation(project.description)
            })
        }
    }

    /**
     *Blur時入力チェック
     * @param {input} e
     */
    const handleBlur = (e) => {
        switch(e.target.name){
            case 'title':
                setProjectErrors({
                    ...projectErrors,
                    'title': titleValidation(e.target.value)
                });
                break;
            case 'description':
                setProjectErrors({
                    ...projectErrors,
                    'description': descValidation(e.target.value)
                });
                break;

            // no default
        }
    }

    /**
     *タイトル入力チェック
     * @param {string} title
     * @return {string} ErrorMessage 
     */
    const titleValidation = (title) => {
        if(!title){
            return '入力必須項目です';
        }
        else if(100 < title.length){
            return '100文字以下で入力してください'
        }
        return '';
    }

    /**
     *詳細入力チェック
     * @param {string} description
     * @return {string} ErrorMessage
     */
    const descValidation = (description) => {
        if(!description){
            return '入力必須項目です';
        }
        return '';
    }

    /**
     *エラーがあればエラーメッセージ表示
     * @param {string} message エラーメッセージ
     * @return {JSX} span
     */
    const renderErrorMessage = (message) => {
        if(message){
            return <span className={classes.errorMessage}>{message}</span>
        }
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
                            {renderErrorMessage(projectErrors.title)}
                            <input
                                type='text'
                                name='title'
                                value={project.title}
                                onChange={handleChange}
                                onBlur={(e) => handleBlur(e)}
                                className={`${classes.input} ${(projectErrors.title !== '') ? classes.error : undefined}`} />
                        </div>
                        <div className={classes.inputCol}>
                            <label>詳細</label>
                            {renderErrorMessage(projectErrors.description)}
                            <input
                                type='text'
                                name='description'
                                value={project.description}
                                onChange={handleChange}
                                onBlur={(e) => handleBlur(e)}
                                className={`${classes.input} ${(projectErrors.description !== '') ? classes.error : undefined}`} />
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