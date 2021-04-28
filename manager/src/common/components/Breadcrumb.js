import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'

export const Breadcrumb = (props) => {

    const renderItems = () => {
        return (
            props.items.map(i => (
                <Link to={`${i.url}/${i.id}`}>{i.title}</Link>
            ))
        )
    }

    return (
        <div>{renderItems()}</div>
    )
}