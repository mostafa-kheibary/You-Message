import { useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, enableIndexedDbPersistence, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase.config';
import { login, logout } from '../store/reducers/user/userSlice';
import { useDispatch } from 'react-redux';
import useToast from './useToast';
import { changeStatus } from '../store/reducers/contextMenu/ContextMenuSlice';
import { IUser } from '../interfaces';

const useInit = () => {
    const auth = getAuth();
    const dispatch = useDispatch();
    const toast = useToast();
    // Initialize auth and check user auth status
    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                onSnapshot(doc(db, 'users', user.uid), { includeMetadataChanges: true }, (snapShot) => {
                    dispatch(login(snapShot.data() as IUser));
                });
            } else {
                dispatch(logout());
            }
        });

        return unSubscribe;
    }, []);

    const registerEvent = () => {
        window.addEventListener('offline', () => toast('No internet! you are offline', 'error'));
        window.addEventListener('online', () => toast('Internet is back! you are online', 'success'));
        window.addEventListener('contextmenu', (e) => e.preventDefault());
        window.addEventListener('click', () => dispatch(changeStatus(false)));
    };
    const init = (): void => {
        enableIndexedDbPersistence(db);
        registerEvent();
    };
    return init;
};

export default useInit;
