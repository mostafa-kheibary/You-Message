import { FC, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Backdrop, Button, CircularProgress, TextField } from '@mui/material';
import useForm from '../../hook/useForm';
import iconImage from '../../assets/image/icon.png';
import './SignIn.css';
import { useDispatch } from 'react-redux';
import { login } from '../../store/reducers/user/userSlice';
import { onValue, ref } from 'firebase/database';
import { db } from '../../config/firebase.config';
import { Loader } from '../../Layout';

const SignIn: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignIn = async () => {
    setLoading(true);
    const auth = getAuth();
    const userCridintional = await signInWithEmailAndPassword(auth, values.email, values.password);
    const userRef = ref(db, `users/${userCridintional.user.uid}`);
    return onValue(
      userRef,
      (snap) => {
        dispatch(login(snap.val()));
        navigate('/');
        setLoading(false);
      },
      { onlyOnce: true }
    );
  };

  const { handleChange, handleSubmit, values } = useForm(handleSignIn, {
    email: '',
    password: '',
  });
  return (
    <div className='sign-in'>
      <Loader isLoading={loading} />
      <div className='sign-in__content'>
        <div className='sign-in__logo'>
          <img className='sign-in__logo-image' src={iconImage} alt='logo' />
          <h1 className='sign-in__title'>You Message 👋</h1>
        </div>
        <form onSubmit={handleSubmit} className='sign-in__inputs'>
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
          <Button className='sign-in__submit-button' variant='contained' type='submit'>
            Sign In
          </Button>
        </form>
        <Link className='sign-in__link' to='/sign-up'>
          Don't have acount ?
        </Link>
      </div>
    </div>
  );
};

export default SignIn;
