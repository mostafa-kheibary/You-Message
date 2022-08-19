import { ChangeEvent, FC, FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, Button, CircularProgress, IconButton, TextareaAutosize, TextField } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import iconImage from '../../assets/image/icon.png';
import useForm from '../../hook/useForm';
import { db } from '../../config/firebase.config';
import useToast from '../../hook/useToast';
import { Loader } from '../../Layout';
import { setDoc, doc, Timestamp, collection, query, where, limit, getDocs, getDoc } from 'firebase/firestore';
import { IUser } from '../../store/reducers/user/userSlice';
import './SignUp.css';

const SignUp: FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [userNameExist, setUserNameExist] = useState<boolean>(false);
  const [userNameProcecing, setUserNameProcecing] = useState<boolean>(false);
  const [signUpStep, setSignUpStep] = useState<0 | 1 | 2>(0);
  const navigate = useNavigate();
  const toast = useToast();

  const handleNextStep = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userNameExist) return;

    const step = signUpStep + 1;
    setSignUpStep(step as 0 | 1 | 2);
  };

  const handleSignUp = async () => {
    setLoading(true);
    const auth = getAuth();
    try {
      const userPayload: IUser = {
        uid: '',
        userName: values.userName,
        bio: '',
        email: values.email,
        lastSeen: Timestamp.now(),
        isTyping: false,
        isOnline: true,
        avatar: '',
      };
      await Promise.all([
        await createUserWithEmailAndPassword(auth, values.email, values.password),
        await setDoc(doc(db, 'users', auth.currentUser!.uid), { ...userPayload, uid: auth.currentUser?.uid }),
      ]);
      navigate('/');
      setLoading(false);
    } catch (e: any) {
      console.log(e);
      const error = e.message as string;
      setLoading(false);
      if (error.includes('email-already-in-use')) {
        toast('email already use by another person', 'error');
      } else if (error.includes('weak-password')) {
        toast('password must be 8 or more', 'error');
      }
    }
  };

  const handleChangeUserName = async (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e);
    setUserNameProcecing(true);
    const userWithUserNameRef = query(collection(db, 'users'), where('userName', '==', e.target.value), limit(1));
    const userDocs = await getDocs(userWithUserNameRef);
    if (!userDocs.empty) {
      setUserNameExist(true);
    } else {
      setUserNameExist(false);
    }
    setUserNameProcecing(false);
  };

  const { handleChange, handleSubmit, values } = useForm(handleSignUp, {
    userName: '',
    email: '',
    password: '',
    name: '',
    bio: '',
  });

  const animationVarient = {
    start: {
      y: 20,
      opacity: 0,
    },
    animate: {
      y: 0,
      opacity: 1,
    },
    exit: {
      y: 20,
      opacity: 0,
    },
  };
  const step1 = () => {
    return (
      <motion.div variants={animationVarient} initial='start' animate='animate' exit='exit'>
        <div className='sign-up__logo'>
          <img className='sign-up__logo-image' src={iconImage} alt='logo' />
          <h1 className='sign-up__title'>You Message 👋</h1>
        </div>
        <form onSubmit={handleNextStep} className='sign-up__inputs'>
          {userNameExist && <span className='sign-up__user-exist'>user name taken</span>}
          <TextField
            error={userNameExist}
            onChange={handleChangeUserName}
            value={values.userName}
            name='userName'
            size='small'
            label='User Name'
            required
            variant='outlined'
          />
          <Button
            disabled={userNameExist || userNameProcecing}
            className='sign-up__submit-button'
            variant='contained'
            type='submit'
          >
            {userNameProcecing ? <CircularProgress size={15} /> : 'Continue'}
          </Button>
        </form>
        <Link className='sign-up__link' to='/sign-in'>
          allready have acount ?
        </Link>
      </motion.div>
    );
  };
  const step2 = () => {
    return (
      <motion.div variants={animationVarient} initial='start' animate='animate' exit='exit'>
        <h4>Add your email and password</h4>
        <form onSubmit={handleNextStep} className='sign-up__inputs'>
          <TextField
            onChange={handleChange}
            value={values.email}
            name='email'
            size='small'
            label='Email'
            required
            type='email'
            variant='outlined'
          />
          <TextField
            onChange={handleChange}
            value={values.password}
            name='password'
            size='small'
            label='Password'
            required
            type='password'
            variant='outlined'
          />
          <Button className='sign-up__submit-button' variant='contained' type='submit'>
            Continue
          </Button>
        </form>
      </motion.div>
    );
  };
  const step3 = () => {
    return (
      <motion.div variants={animationVarient} initial='start' animate='animate' exit='exit'>
        <form onSubmit={handleNextStep} className='sign-up__inputs'>
          <Avatar className='sign-up__avatar' />
          <TextField
            onChange={handleChange}
            value={values.name}
            name='name'
            size='small'
            label='Name'
            required
            type='text'
            variant='outlined'
          />
          <TextareaAutosize onChange={handleChange} value={values.bio} name='bio' minRows={3} required />
          <Button className='sign-up__submit-button' variant='contained' type='submit'>
            Sign up
          </Button>
        </form>
      </motion.div>
    );
  };
  return (
    <div className='sign-up'>
      <button onClick={() => setSignUpStep((signUpStep - 1) as 0 | 1 | 2)}>c</button>
      <Loader isLoading={loading} />
      <div className='sign-up__content'>
        <AnimatePresence key={signUpStep}>
          {signUpStep === 0 ? step1() : signUpStep === 1 ? step2() : signUpStep === 2 ? step3() : ''}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SignUp;
