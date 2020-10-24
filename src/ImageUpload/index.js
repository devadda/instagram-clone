import { Button } from '@material-ui/core';
import React, { useState} from 'react';
import {storage, db} from '../firebase';
import firebase from 'firebase';
import LinearProgress from '@material-ui/core/LinearProgress';

import './imageUpload.css'
function Index({username}) {

    const [caption, setCaption] = useState('');
    const [image, setImage] = useState('');
    const [progress, setProgress] = useState(0);

    const handleChange = (e) => {
        if(e.target.files[0]) {
            setImage(e.target.files[0])
        }
    }

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress)
            },
            (error) => {
                console.log(error)
                alert(error.message)
            },
            () => {
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        db.collection('posts').add({
                            timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username
                        })
                        setProgress(0)
                        setImage('')
                        setCaption('')
                    })
            }
        )
    }

    return (
        <div className="imageUpload">
            <LinearProgress variant="determinate" value={progress} />
            <input type="text" value={caption} onChange={event => setCaption(event.target.value)} />
            <input type="file" onChange={handleChange} />
            <Button onClick={handleUpload}>Upload</Button>
        </div>
    )
}

export default Index
