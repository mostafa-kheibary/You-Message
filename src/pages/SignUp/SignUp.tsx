import { FC, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import iconImage from '../../assets/image/icon.png';
import useForm from '../../hook/useForm';
import { ref, set } from 'firebase/database';
import { db } from '../../config/firebase.config';
import { IUser } from '../../types/stateTypes';
import './SignUp.css';
import useToast from '../../hook/useToast';
import { Loader } from '../../Layout';

const avatarImage =
  'https://s3-us-west-1.amazonaws.com/eegprd-files-uploaded-by-attendees-and-admins/panwsymphony/src/a0L4T000002PFGCUA4-Headshot';

const SignUp: FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();

  const handleSignUp = async () => {
    setLoading(true);
    const auth = getAuth();
    try {
      const { user } = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const userSchema: IUser = {
        uid: user.uid,
        userName: values.userName,
        bio: '',
        email: values.email,
        lastSeen: new Date().getTime().toString(),
        contact: [],
        isTyping: false,
        isOnline: true,
        avatar: avatarImage,
      };
      set(ref(db, `users/${user.uid}`), userSchema);
      navigate('/');
      setLoading(false);
    } catch (e: any) {
      const error = e.message as string;
      setLoading(false);
      if (error.includes('email-already-in-use')) {
        toast('email already use by another person', 'error');
      } else if (error.includes('weak-password')) {
        toast('password must be 8 or more', 'error');
      }
    }
  };

  const { handleChange, handleSubmit, values } = useForm(handleSignUp, {
    userName: '',
    email: '',
    password: '',
  });

  return (
    <div className='sign-up'>
      <Loader isLoading={loading} />
      <div className='sign-up__content'>
        <div className='sign-up__logo'>
          <img className='sign-up__logo-image' src={iconImage} alt='logo' />
          <h1 className='sign-up__title'>You Message 👋</h1>
        </div>
        <form onSubmit={handleSubmit} className='sign-up__inputs'>
          <TextField
            onChange={handleChange}
            value={values.userName}
            name='userName'
            size='small'
            label='User Name'
            required
            variant='outlined'
          />
          <TextField
            onChange={handleChange}
            value={values.email}
            name='email'
            size='small'
            label='Email'
            required
            variant='outlined'
          />
          <TextField
            onChange={handleChange}
            value={values.password}
            name='password'
            size='small'
            label='Password'
            required
            variant='outlined'
          />
          <Button className='sign-up__submit-button' variant='contained' type='submit'>
            Sign Up
          </Button>
        </form>
        <Link className='sign-up__link' to='/sign-in'>
          allready have acount ?
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
