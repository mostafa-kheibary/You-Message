import ArrowBackIosNew from '@mui/icons-material/ArrowBackIosNew';
import { Avatar, Button, FilledInput, IconButton } from '@mui/material';
import { getAuth, signOut } from 'firebase/auth';
import { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, selectUser } from '../../store/reducers/user/userSlice';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import './Profile.css';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase.config';
import useToast from '../../hook/useToast';

const Profile: FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const auth = getAuth();
    const { info } = useSelector(selectUser);
    const [editMode, setEditMode] = useState<boolean>(false);
    const toast = useToast();

    const [editInfo, setEditInfo] = useState<{ name: string; bio: string }>({
        name: info?.name || '',
        bio: info?.bio || '',
    });

    const handleSignOut = async () => {
        await signOut(auth);
        dispatch(logout);
        navigate('/');
    };
    const handleChangeEditMode = async () => {
        if (editMode) {
            setEditMode(false);
            try {
                await updateDoc(doc(db, 'users', info!.uid), {
                    name: editInfo.name,
                    bio: editInfo.bio,
                });
                toast('profile updated', 'success');
            } catch (error) {
                toast('error happend,profile not update', 'error');
            }
            return;
        }
        setEditMode(true);
    };
    const handleChange = (e: any) => {
        setEditInfo({ ...editInfo, [e.target.name]: e.target.value });
    };
    return (
        <div className='profile'>
            <div className='profile__backdrop'></div>
            <IconButton className='profile__back-button' onClick={() => navigate(-1)}>
                <ArrowBackIosNew />
            </IconButton>
            <div className='profile__content'>
                <div className='profile__avatar-wrapper'>
                    <Avatar src={info?.avatar} className='profile__avatar' />
                    <IconButton onClick={handleChangeEditMode} className='profile__edit'>
                        {editMode ? <CheckIcon /> : <EditIcon />}
                    </IconButton>
                </div>
                <FilledInput
                    name='name'
                    onChange={handleChange}
                    disabled={!editMode}
                    value={editInfo.name}
                    size='small'
                    className='profile__name'
                />
                <FilledInput
                    name='bio'
                    onChange={handleChange}
                    disabled={!editMode}
                    value={editInfo.bio}
                    size='small'
                    className='profile__bio'
                />
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
