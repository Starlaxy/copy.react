import React from 'react'

import classes from  '../css/Comfirm.module.css'

export const Confirm = (props) => {

    return (
        <div className={classes.modalWrap}>
            <div className={classes.modal}>
                <div className={classes.textWrap}>
                    <p className={classes.title}>{props.title}</p>
                    <p className={classes.description}>{props.description}</p>
                </div>
                <div className={classes.btnWrap}>
                    <button className={classes.cancelBtn} onClick={() => props.setIsConfirmModal(false)}>CANCEL</button>
                    <button className={classes.confirmBtn} onClick={() => props.confirmEvent()}>OK</button>
                </div>
            </div>
        </div>
    )
}