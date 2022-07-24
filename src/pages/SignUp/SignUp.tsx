import { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import iconImage from '../../assets/image/icon.png';
import useForm from '../../hook/useForm';
import { useDispatch } from 'react-redux';
import './SignUp.css';
import { login } from '../../store/reducers/user/userSlice';

const SignUp: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignUp = async () => {
    const auth = getAuth();
    const userCriditional = await createUserWithEmailAndPassword(auth, values.email, values.password);
    dispatch(login(userCriditional.user));
    navigate('/');
  };

  const { handleChange, handleSubmit, values } = useForm(handleSignUp, {
    userName: '',
    email: '',
    password: '',
  });

  return (
    <div className='sign-up'>
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
