import { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Button, TextField } from '@mui/material';
import useForm from '../../hook/useForm';
import iconImage from '../../assets/image/icon.png';
import './SignIn.css';
import { useDispatch } from 'react-redux';
import { login } from '../../store/reducers/user/userSlice';

const SignIn: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignIn = async () => {
    const auth = getAuth();
    const userCridintional = await signInWithEmailAndPassword(auth, values.email, values.password);
    dispatch(login(userCridintional.user));
    navigate('/');
  };

  const { handleChange, handleSubmit, values } = useForm(handleSignIn, {
    email: '',
    password: '',
  });
  return (
    <div className='sign-in'>
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
