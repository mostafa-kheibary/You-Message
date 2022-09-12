import ArrowBackIosNew from '@mui/icons-material/ArrowBackIosNew';
import { Button, IconButton, TextField } from '@mui/material';
import { getAuth, signOut } from 'firebase/auth';
import { FC, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { logout, selectUser } from '../../store/reducers/user/userSlice';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase.config';
import useToast from '../../hook/useToast';
import { Loader } from '../../Layout';
import { ProfileAvatar } from '../../Components';
import './Profile.css';

const Profile: FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const auth = getAuth();
    const { info } = useSelector(selectUser);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const toast = useToast();

    const [editInfo, setEditInfo] = useState<{ name: string; bio: string }>({
        name: info?.name || '',
        bio: info?.bio || '',
    });

    const handleSignOut = async () => {
        navigate('/sign-in');
        await signOut(auth);
        dispatch(logout);
    };
    const handleChangeEditMode = async () => {
        // toggle editmode
        if (!editMode) {
            setEditMode(true);
            return;
        }
        // check for no changes
        if (editInfo.name.trim() === info!.name && editInfo.bio.trim() === info?.bio) {
            setEditMode(false);
            return;
        }

        setEditMode(false);
        setIsLoading(true);
        try {
            await updateDoc(doc(db, 'users', info!.uid), {
                name: editInfo.name,
                bio: editInfo.bio,
            });
            setIsLoading(false);
            toast('profile updated', 'success');
        } catch (error) {
            setIsLoading(false);
            toast('error happend,profile not update', 'error');
        }
    };
    const handleChange = (e: any) => {
        setEditInfo({ ...editInfo, [e.target.name]: e.target.value });
    };
    const MotionIconButton = useMemo(() => motion(IconButton), []);
    return (
        <div className='profile'>
            <div className='profile__backdrop'></div>
            <span className='profile__you-message'>You Message V 0.10</span>
            <Loader isLoading={isLoading} />
            <IconButton color='primary' className='profile__back-button' onClick={() => navigate(-1)}>
                <ArrowBackIosNew />
            </IconButton>
            <div className='profile__content'>
                <div className='profile__avatar-wrapper'>
                    <ProfileAvatar
                        name={info!.name}
                        src={info!.avatar}
                        color={info!.avatarColor}
                        className='profile__avatar'
                    />
                    <MotionIconButton
                        animate={editMode ? { rotate: 360 } : { rotate: 1 }}
                        onClick={handleChangeEditMode}
                        className='profile__edit'
                    >
                        {editMode ? <CheckIcon /> : <EditIcon />}
                    </MotionIconButton>
                </div>
                <div className='profile__input-wrapper'>
                    <h4 className='profile__input-wrapper-title'>Edit Information</h4>
                    <TextField variant='standard' disabled label='user name' value={info?.userName || ''} />
                    <TextField
                        variant='standard'
                        name='name'
                        label='name'
                        onChange={handleChange}
                        disabled={!editMode}
                        value={editInfo.name}
                        size='small'
                    />
                    <TextField
                        variant='standard'
                        multiline
                        sx={{ whiteSpace: 'pre-wrap' }}
                        name='bio'
                        label='bio'
                        onChange={handleChange}
                        disabled={!editMode}
                        value={editInfo.bio}
                        size='small'
                    />
                </div>
                <div className='profile__buttons'>
                    <Button color='error' onClick={handleSignOut}>
                        sign out
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
