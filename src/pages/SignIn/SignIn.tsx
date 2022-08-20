import { FC, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Button, TextField } from '@mui/material';
import useForm from '../../hook/useForm';
import iconImage from '../../assets/image/icon.png';
import { useDispatch } from 'react-redux';
import { IUser, login } from '../../store/reducers/user/userSlice';
import { db } from '../../config/firebase.config';
import { Loader } from '../../Layout';
import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import './SignIn.css';

const SignIn: FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSignIn = async () => {
        setLoading(true);
        const auth = getAuth();

        const [_, userData] = await Promise.all([
            await signInWithEmailAndPassword(auth, values.email, values.password),
            await getDoc(doc(db, 'users', auth.currentUser!.uid)),
        ]);

        dispatch(login(userData.data() as IUser));
        navigate('/');
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
            </motion.div>
        </div>
    );
};

export default SignIn;
