import React, { useRef, useState } from 'react';
import { Transition } from 'react-transition-group';
import { changeTag } from '../api/tag';
import classes from '../css/TagContent.module.css';


export const TagContent = (props) => {

    const nodeRef = useRef();

    // タグフォームアニメーション
    const [mount, setMount] = useState(false);
    const transitionStyle = {
        entering: {
            maxHeight: '100vh',
            transition: 'all 1s ease',
        },
        entered: {
            maxHeight: '100vh',
            transition: 'all 1s ease',
        },
        exiting: {
            maxHeight: 0,
            transition: 'all 1s ease',
        },
        exited: {
            maxHeight: 0,
            transition: 'all 1s ease',
        },
    };

    /**
     *フォーム表示イベント
     */
    const handleDisplay = () => {
        setMount(!mount);
        props.setMainVideoId(props.video);
        props.setMainVideoEle(props.player.find(p => p.id === String(props.video)))
    }

    /**
     *領域指定ボタン押下イベント
     * @param {MouseEvent} e
     */
    const handleClickAreaBtn = (e) => {
        e.preventDefault();
        props.changeCurrentFrame(props.display_frame);
        props.createTagArea(e, props.id);
    }

    /**
     *Form項目変更イベント 
     * @param {onChange} e
     */
    const handleChange = (e) => {
        props.handleChangeTagForm(e, props.id, props.video);
    }

    /**
     * タグタイプ毎の入力項目を返す関数
     *
     * @return {JSX} input 
     */
    const renderTagTypeCol = () => {
        switch (props.action_type){
            case 'link':
                return (
                    <>
                        <label htmlFor={'link-rul' + props.id} className={classes.inputLabel}>URL</label>
                        <input id={'link-url' + props.id} className={classes.inputText} type='url' name='url' value={ props.url } onChange={ (e) => handleChange(e) } />
                    </>
                )

            case 'popup':
                return (
                    <>
                        <p className={classes.inputColText}>テンプレート選択</p>
                        <div className={classes.radioWrap}>
                            <label htmlFor={'default' + props.id} className={`${classes.radioLabel} ${(props.popup_type === 'default') ? classes.radioChecked : ''}`}>通常</label>
                            <input id={'default' + props.id} className={classes.radioInput} type='radio' name='popup_type' value='default' checked={ props.popup_type === 'default' } onChange={ (e) => handleChange(e) } />
                            <label htmlFor={'vertical' + props.id} className={`${classes.radioLabel} ${(props.popup_type === 'vertical') ? classes.radioChecked : ''}`}>縦</label>
                            <input id={'vertical' + props.id} className={classes.radioInput} type='radio' name='popup_type' value='vertical' checked={ props.popup_type === 'vertical' } onChange={ (e) => handleChange(e) } />
                            <label htmlFor={'text' + props.id} className={`${classes.radioLabel} ${(props.popup_type === 'text') ? classes.radioChecked : ''}`}>テキストのみ</label>
                            <input id={'text' + props.id} className={classes.radioInput} type='radio' name='popup_type' value='text' checked={ props.popup_type === 'text' } onChange={ (e) => handleChange(e) } />
                        </div>
                        {renderFileCol()}
                        <label htmlFor={'popup-text' + props.id} className={classes.inputLabel}>表示文字</label>
                        <input id={'popup-text' + props.id} className={classes.inputText} type='text' name='popup_text' value={ props.popup_text } onChange={ (e) => handleChange(e) } />
                        <label htmlFor={'popup-btn-text' + props.id} className={classes.inputLabel}>ボタン文字</label>
                        <input id={'popup-btn-text' + props.id} className={classes.inputText} type='text' name='popup_btn_text' value={ props.popup_btn_text } onChange={ (e) => handleChange(e) } />
                        <label htmlFor={'popup-url' + props.id} className={classes.inputLabel}>リンクURL</label>
                        <input id={'popup-url' + props.id} className={classes.inputText} type='text' name='popup_btn_url' value={ props.popup_btn_url } onChange={ (e) => handleChange(e) } />
                    </>
                )
            
            default:
                return (
                    <>
                        <label htmlFor={'story-next-video' + props.id} className={classes.inputLabel}>ストーリー先動画</label>
                        <select id='story-next-video' value={props.story_next_video} className={classes.storySelect} name='story_next_video' onChange={ (e) => handleChange(e) }>
                            {renderStoryVideoCol()}
                        </select>
                        <label htmlFor={'story-start-frame' + props.id} className={classes.inputLabel}>ストーリー開始フレーム</label>
                        <input name={'story-start-frame' + props.id} type='number' value={ props.story_start_frame } onChange={ (e) => handleChange(e) } />
                    </>
                )
        }
    }

    /**
     *POPUPTYPEテキスト以外の時にFILEフォーム表示
     * @return {JSX} FILEフォーム
     */
    const renderFileCol = () => {
        if(props.popup_type !== 'text'){
            return (
                <>
                    <label htmlFor={'popup-img' + props.id} className={classes.inputLabel}>ファイル</label>
                    <input id={'popup-img' + props.id} type='file' name='popup_img' accept='image/*' onChange={ (e) => handleChange(e) } />
                </>
            )
        }
    }

    /**
     *Story選択肢表示
     * @return {JSX} <option> 
     */
    const renderStoryVideoCol = () => {
        if(props.storyVideo.length){
            const storyVideo = props.storyVideo.map(sv => {
                return <option key={sv.id} value={sv.id}>{sv.title}</option>
            })
            return storyVideo
        }
    }

    /**
     * stateからFormDataを作成し、登録API通信
     * 成功時：親の紐づく動画の全情報を取得し、親のvideostate変更
     * @param {onClick} e
     */
    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', props.title);
        formData.append('video',props.video)
        formData.append('action_type', props.action_type);
        formData.append('left', props.left);
        formData.append('top', props.top);
        formData.append('width', props.width);
        formData.append('height', props.height);
        formData.append('display_frame', props.display_frame);
        formData.append('hide_frame', props.hide_frame);

        switch (props.action_type){
            case 'link':
                formData.append('url', props.url);
                break
            
            case 'popup':
                formData.append('popup_type', props.popup_type);
                if(props.popup_type !== 'text'){
                    formData.append('popup_img', props.popup_img, props.popup_img.name);
                }
                formData.append('popup_text', props.popup_text);
                formData.append('popup_btn_text', props.popup_btn_text);
                formData.append('popup_btn_url', props.popup_btn_url);
                break;

            default:
                formData.append('story_next_video', props.story_next_video);
                formData.append('story_start_frame', props.story_start_frame);
                break;
        }

        changeTag(props.id, formData)
        .then(t => {
            let newVideo = [...props.all_video];
            const targetTags = newVideo.find(v => v.id === t.video).tags;
            // ---------------------------------------------------------------正常に変換されない？
            targetTags.forEach(tt => {
                if(tt.id === t.id){
                    tt = t
                }
            })
            props.setVideo(newVideo);
        })
        .catch(e => {
            throw new Error(e);
        });
    }

    return(
        <form className={classes.tagForm}>
            <label htmlFor={'title' + props.id} onClick={() => handleDisplay()} className={classes.inputLabel}>タイトル</label>
            <input id={'title' + props.id} className={classes.inputText} type='text' name='title' value={ props.title } onChange={ handleChange } />
            <Transition nodeRef={nodeRef} in={mount} timeout={1000} >
                {(state) =>
                    <div ref={nodeRef} className={classes.tagCol} style={transitionStyle[state]}>
                        <button className={classes.areaBtn} onClick={(e) => handleClickAreaBtn(e)}>領域指定</button>
                        <p className={classes.inputColText}>タグタイプ</p>
                        <div className={classes.radioWrap}>
                            <label htmlFor={'link-tag' + props.id} className={`${classes.radioLabel} ${(props.action_type === 'link') ? classes.radioChecked : ''}`}>外部リンク</label>
                            <input id={'link-tag' + props.id} className={classes.radioInput} type='radio' name='action_type' value='link' checked={ props.action_type === 'link' } onChange={ (e) => handleChange(e) } />
                            <label htmlFor={'popup-tag' + props.id} className={`${classes.radioLabel} ${(props.action_type === 'popup') ? classes.radioChecked : ''}`}>ポップアップ</label>
                            <input id={'popup-tag' + props.id} className={classes.radioInput} type='radio' name='action_type' value='popup' checked={ props.action_type === 'popup' } onChange={ (e) => handleChange(e) } />
                            <label htmlFor={'story-tag' + props.id} className={`${classes.radioLabel} ${(props.action_type === 'story') ? classes.radioChecked : ''}`}>ストーリー</label>
                            <input id={'story-tag' + props.id} className={classes.radioInput} type='radio' name='action_type' value='story' checked={ props.action_type === 'story' } onChange={ (e) => handleChange(e) } />
                        </div>
                        { renderTagTypeCol() }
                        <label htmlFor={'display-frame' + props.id} className={classes.inputLabel}>開始フレーム</label>
                        <input id={'display-frame' + props.id} className={classes.inputText} type='number' name='display_frame' value={ props.display_frame } onChange={ (e) => handleChange(e) } />
                        <label htmlFor={'hide-frame' + props.id} className={classes.inputLabel}>終了フレーム</label>
                        <input id={'hide-frame' + props.id} className={classes.inputText} type='number' name='hide_frame' value={ props.hide_frame } onChange={ (e) => handleChange(e) } />
                        <div className={classes.btnWrap}>
                            <button className={classes.deleteBtn} onClick={ (e) => props.showConfirmModal(e, props.id, props.title) }>削除</button>
                            <button className={classes.submitBtn} onClick={ (e) => handleSubmit(e) }>送信</button>
                        </div>
                    </div>
                }
            </Transition>
        </form>
    )
}