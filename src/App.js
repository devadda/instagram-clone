import React, {useState, useEffect} from 'react';
import './App.css';
import Post from './Post/Post';
import {db, auth} from './firebase'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, TextField } from '@material-ui/core';
import ImageUpload from './ImageUpload';
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }),
);

function App() {

  const [posts, setPosts] = useState([])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    auth.onAuthStateChanged(authUser => {
      if(authUser){
        setUser(authUser)
        console.log(user)
        // if(authUser.displayName){

        // }else{
        //   return authUser.updateProfile({
        //     displayName: username
        //   })
        // }
      }else{
        setUser(null);
      }
    })
  }, [user, username])

  useEffect(()=> {
    db.collection('posts').orderBy('timeStamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id, post: doc.data()
      })))
    })
    console.log(posts)
  }, [])

  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [openSignIn, setOpenSignIn] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSignInOpen = () => {
    setOpenSignIn(true);
  };

  const handleSignInClose = () => {
    setOpenSignIn(false);
  };

  const handleSignUpMethod = event => {
    event.preventDefault();
    console.log(email, password)
    auth.createUserWithEmailAndPassword(email, password)
    .then(auth => {
      setOpen(false);
      setEmail('');
      setPassword('');
      return auth.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message))
  }

  const handleSignInMethod = (event) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
    .then(authUser => {
      setUser(authUser);
      setOpenSignIn(false);
    })
    .catch(error => {
      alert(error.message)
    })
  }

  return (
    <div className="App">

      {/* modal code */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
          <center><img 
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="logo"
        /></center>
          <form className='signUpForm' noValidate autoComplete="off">
            <TextField id="standard-basic" label="Name"  value={username} onChange={event => setUsername(event.target.value)} />
            <TextField id="standard-basic" label="Email" value={email} onChange={event => setEmail(event.target.value)} />
            <TextField id="standard-basic" label="Password" value={password} onChange={event => setPassword(event.target.value)} />
            <Button onClick={handleSignUpMethod}>
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={handleSignInClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
          <center><img 
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="logo"
        /></center>
          <form className='signUpForm' noValidate autoComplete="off">
            <TextField id="standard-basic" label="Email" value={email} onChange={event => setEmail(event.target.value)} />
            <TextField id="standard-basic" label="Password" value={password} onChange={event => setPassword(event.target.value)} />
            <Button onClick={handleSignInMethod}>
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>

      <div className="app_header">
        <img 
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="logo"
        />
      {user ? (
          <Button type="button" onClick={() => auth.signOut()}>
          Log Out
        </Button>
      ):
      (
        <div>
          <Button type="button" onClick={handleOpen}>
            Sign Up
          </Button>
          / 
          <Button type="button" onClick={handleSignInOpen}>
          Sign In
        </Button>
        </div>
      )}
      
      </div>
      <div className="app_posts">
      {user?.displayName ?
        <div>
          <ImageUpload username={user.displayName} />
        </div>
          
        :
          'Sorry Please Login to upload Post'
        }

      {posts.map(({id, post})=> (
        <Post key={id} userName={post.username} avatarUrl={post.avatarUrl} imageUrl={post.imageUrl} captionText={post.caption} />
      ))}
      </div>
      

    </div>
  );
}

export default App;
