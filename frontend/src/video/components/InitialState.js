export const initialTagState = {
        'video': '',
        'title': '',
        'action_type': 'link',
        'url': '',
        'story_next_video': 0,
        'story_start_flame': 0,
        'popup_type': 'default',
        'popup_img': null,
        'popup_text': '',
        'popup_btn_text': '',
        'popup_btn_url': '',
        'left': '',
        'top': '',
        'width': 0,
        'height': 0,
        'display_frame': 0,
        'hide_frame': 0,
        'created_at': '',
}

export const initialVideoState = {
    id: '',
    title: '',
    video: null,
    tags: initialTagState,
}

export const initialCreatingTagState = {
    id: undefined,
    startX: 0,
    startY: 0,
}