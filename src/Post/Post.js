import React from 'react'
import Avatar from '@material-ui/core/Avatar';
import './post.css'
function Post({avatarUrl, imageUrl, userName, captionText}) {
    return (
        <div className="post">
            <div className="post__header">
                <Avatar 
                    className="post__avatar" 
                    alt="Remy Sharp" 
                    src={avatarUrl} 
                />
                <h3>{userName}</h3>
            </div>
            <img 
                src={imageUrl} 
                alt="" 
                className="post__image"
            />

    <h4 className="post__text"><strong>{userName}: </strong>{captionText}</h4>
        </div>
    )
}

export default Post;
