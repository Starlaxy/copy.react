import { initialTagErrors } from '../components/InitialState'

export const TagValidator = (tagState) => {

    const TITLE_LENGTH = 20;
    const POPUP_TEXT_LENGTH = 100;
    const POPUP_BTN_TEXT_LENGTH = 20;
    const URL_REG = new RegExp(/https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#\u3000-\u30FE\u4E00-\u9FA0\uFF01-\uFFE3]+/g);

    const errorMessages = initialTagErrors;
    
    // タイトル
    if(!tagState.title) {
        errorMessages.title = '必須項目です';
    }
    else if(TITLE_LENGTH < tagState.title.length) {
        errorMessages.title = `${TITLE_LENGTH}文字以内で入力してください。`;
    }
    else {
        errorMessages.title = '';
    }
    // 領域
    if((tagState.width === 0) || (tagState.height === 0)){
        errorMessages.area = '領域を指定してください';
    }
    else {
        errorMessages.area = '';
    }
    // タイプごとにバリデーション（タイプ外の物はエラーメッセージを空にする）
    switch(tagState.action_type){
        case 'link':
            // URL
            if(!tagState.url) {
                errorMessages.url = '必須項目です';
            }
            else if(!URL_REG.test(tagState.url)) {
                errorMessages.url = '正しい形式で入力してください';
            }
            else {
                errorMessages.url = '';
            }
            // storyエラー初期化
            errorMessages.story_next_video = '';
            errorMessages.story_start_frame = '';
            // popupエラー初期化
            errorMessages.popup_img = '';
            errorMessages.popup_text = '';
            errorMessages.popup_btn_text = '';
            errorMessages.popup_btn_url = '';
            break;

        case 'popup':
            // 画像
            if(tagState.popup_type !== 'text' && !tagState.popup_img) {
                errorMessages.popup_img = '必須項目です';
            }
            else {
                errorMessages.popup_img = '';
            }
            // 表示文字
            if(!tagState.popup_text) {
                errorMessages.popup_text = '必須項目です';
            }
            else if(POPUP_TEXT_LENGTH < tagState.popup_text.length) {
                errorMessages.popup_text = `${POPUP_TEXT_LENGTH}文字以内で入力してください`;
            }
            else {
                errorMessages.popup_text = '';
            }
            // ボタン文字
            if(POPUP_BTN_TEXT_LENGTH < tagState.popup_btn_text.length) {
                errorMessages.popup_btn_text = `${POPUP_BTN_TEXT_LENGTH}文字以内で入力してください`
            }
            else {
                errorMessages.popup_btn_text = '';
            }
            // リンクURL
            if(!URL_REG.test(tagState.popup_btn_url) && tagState.popup_btn_url) {
                errorMessages.popup_btn_url = '正しい形式で入力してください';
            }
            else {
                errorMessages.popup_btn_url = '';
            }
            // linkエラー初期化
            errorMessages.url = '';
            // storyエラー初期化
            errorMessages.story_next_video = '';
            errorMessages.story_start_frame = '';
            break;

        case 'story':
            console.log(tagState.story_next_video);
            if(!tagState.story_next_video){
                console.log('true')
            }
            else {
                console.log('false')
            }
            if(!tagState.story_next_video) {
                errorMessages.story_next_video = '必須項目です';
            }
            else {
                errorMessages.story_next_video = '';
            }
            if(tagState.story_start_frame === '') {
                errorMessages.story_start_frame = '必須項目です';
            }
            else {
                errorMessages.story_start_frame = '';
            }
            // linkエラー初期化
            errorMessages.url = '';
            // popupエラー初期化
            errorMessages.popup_img = '';
            errorMessages.popup_text = '';
            errorMessages.popup_btn_text = '';
            errorMessages.popup_btn_url = '';
            break;
        
        // no default
    }

    // 開始フレーム
    if(tagState.display_frame === '') {
        errorMessages.display_frame = '必須項目です';
    }
    else {
        errorMessages.display_frame = '';
    }
    // 終了フレーム
    if(!tagState.hide_frame === '') {
        errorMessages.hide_frame = '必須項目です';
    }
    else {
        errorMessages.hide_frame = '';
    }
    return errorMessages;
    
}