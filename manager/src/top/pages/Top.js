import React from 'react'
import { Link } from 'react-router-dom'
import '../css/top.css'

export const Top = () => {
    return(
        <div>
            <h2>TOP</h2>
            <Link to="/projectlist">プロジェクト一覧へ</Link>
        </div>
    )
}