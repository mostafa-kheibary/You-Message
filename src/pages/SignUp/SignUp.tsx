import { FC, FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { createUserWithEmailAndPassword, getAuth, updateProfile } from 'firebase/auth';
import { setDoc, doc, Timestamp, collection, query, where, limit, getDocs } from 'firebase/firestore';
import { uuidv4 } from '@firebase/util';
import iconImage from '../../assets/image/icon.png';
import useForm from '../../hook/useForm';
import { db } from '../../config/firebase.config';
import useToast from '../../hook/useToast';
import { Loader } from '../../Layout';
import { IUser } from '../../store/reducers/user/userSlice';
import { Avatar, Button, CircularProgress, IconButton, Step, StepLabel, Stepper, TextField } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import emailImage from '../../assets/image/email.png';
import classNames from '../../utils/classNames';
import './SignUp.css';

const SignUp: FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [userNameExist, setUserNameExist] = useState<boolean>(false);
    const [userNameProcecing, setUserNameProcecing] = useState<boolean>(false);

    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [profilePicUrl, setProfilePicUrl] = useState<string>('');
    const [uplaodPercent, setUploadPercent] = useState<number>(0);

    const [signUpStep, setSignUpStep] = useState<0 | 1 | 2>(0);
    const storage = getStorage();
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
                name: values.name,
                bio: values.bio,
                email: values.email,
                lastSeen: Timestamp.now(),
                isTyping: false,
                isOnline: true,
                avatar: profilePicUrl,
            };
            await Promise.all([
                await createUserWithEmailAndPassword(auth, values.email, values.password),
                await updateProfile(auth.currentUser!, { photoURL: profilePicUrl }),
                await setDoc(doc(db, 'users', auth.currentUser!.uid), { ...userPayload, uid: auth.currentUser?.uid }),
            ]);
            navigate('/');
            setLoading(false);
        } catch (e: any) {
            console.log(e);
            setLoading(false);
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

    const handleUploadProfilePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const urlCreator = window.URL || window.webkitURL;
        const storageRef = ref(storage, `profile-photos/${uuidv4()}`);
        const imageUrl = urlCreator.createObjectURL(e.target.files[0]);
        setProfilePic(imageUrl);

        const uploadTask = uploadBytesResumable(storageRef, e.target.files[0]);
        uploadTask.on(
            'state_changed',
            (snapShot) => {
                // progress
                const progress = (snapShot.bytesTransferred / snapShot.totalBytes) * 100;
                setUploadPercent(progress);
            },
            (error) => {
                // error
                toast('cant upload the image,try again', 'error');
            },
            async () => {
                // compelite
                const link = await getDownloadURL(uploadTask.snapshot.ref);
                setProfilePicUrl(link);
            }
        );
    };

    const progress = () => {
        if (+uplaodPercent.toFixed(0) > 0 && +uplaodPercent.toFixed(0) < 100) {
            return (
                <CircularProgress
                    className='sign-up__progress'
                    variant='determinate'
                    value={+uplaodPercent.toFixed(0)}
                />
            );
        }
    };

    const animationVarient = {
        start: {
            x: 50,
        },
        animate: {
            x: 0,
        },
        exit: {
            x: -50,
        },
    };

    const { handleChange, handleSubmit, values } = useForm(handleSignUp, {
        userName: '',
        email: '',
        password: '',
        name: '',
        bio: '',
    });

    const step1 = () => {
        return (
            <motion.div variants={animationVarient} initial={{ y: 50 }} animate={{ y: 0 }} exit='exit'>
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
                <img className='sign-up__email-image' src={emailImage} alt='' />
                <h4 className='sign-up__email-text'>Add email and password</h4>
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
                <form onSubmit={handleSubmit} className='sign-up__inputs'>
                    <div className='sign-up__avatar-wrapper'>
                        <Avatar
                            src={profilePic ? profilePic : ''}
                            className={classNames(
                                'sign-up__avatar',
                                uplaodPercent < 100 && uplaodPercent > 0 ? 'uploading' : ''
                            )}
                        />
                        {progress()}
                        <input
                            multiple={false}
                            accept='image/*'
                            onChange={handleUploadProfilePhoto}
                            type='file'
                            name='ppu'
                            hidden
                            id='ppu'
                        />
                        <IconButton color='primary' className='sign-up__change-avatar'>
                            <label className='sign-up__avatar__lable' htmlFor='ppu'>
                                <AddPhotoAlternateIcon />
                            </label>
                        </IconButton>
                    </div>
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
                    <TextField label='bio' onChange={handleChange} value={values.bio} name='bio' minRows={3} />
                    <Button className='sign-up__submit-button' variant='contained' type='submit'>
                        Finish
                    </Button>
                </form>
            </motion.div>
        );
    };

    return (
        <div className='sign-up'>
            <Stepper className='sign-up__stepper' activeStep={signUpStep} alternativeLabel>
                <Step>
                    <StepLabel>Select User Name</StepLabel>
                </Step>
                <Step>
                    <StepLabel>Add Email Password</StepLabel>
                </Step>
                <Step>
                    <StepLabel>Complete your Profile</StepLabel>
                </Step>
            </Stepper>
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
