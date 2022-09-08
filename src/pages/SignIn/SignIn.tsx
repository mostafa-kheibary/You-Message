import { FC, useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';

import useForm from '../../hook/useForm';
import iconImage from '../../assets/image/icon.png';
import { login } from '../../store/reducers/user/userSlice';
import { IUser } from '../../interfaces';
import { db } from '../../config/firebase.config';
import { Loader } from '../../Layout';
import useToast from '../../hook/useToast';
import './SignIn.css';

const SignIn: FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const toast = useToast();

    const handleSignIn = async () => {
        setLoading(true);
        const auth = getAuth();
        try {
            const [_, userData] = await Promise.all([
                await signInWithEmailAndPassword(auth, values.email, values.password),
                await getDoc(doc(db, 'users', auth.currentUser!.uid)),
            ]);
            dispatch(login(userData.data() as IUser));
        } catch (error) {
            const { message } = error as Error;
            setLoading(false);

            if (message.includes('invalid-email')) {
                toast('email invalid, enter correct email', 'error');
            } else if (message.includes('user-not-found')) {
                toast('user not found, enter valid email', 'error');
            } else if (message.includes('wrong-password')) {
                toast('password is incorrect', 'error');
            }
            console.log(message);
        }
        navigate('/');
        setLoading(false);
    };

    const { handleChange, handleSubmit, values } = useForm(handleSignIn, {
        email: '',
        password: '',
    });
    return (
        <div className='sign-in'>
            <Loader isLoading={loading} />
            <motion.div initial={{ y: 50 }} animate={{ y: 0 }} className='sign-in__content'>
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
                        type='email'
                        required
                        variant='outlined'
                    />
                    <TextField
                        type='password'
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
            </motion.div>
        </div>
    );
};

export default SignIn;
