import { useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { onDisconnect, onValue, ref, set, serverTimestamp } from 'firebase/database';
import { doc, enableIndexedDbPersistence, onSnapshot } from 'firebase/firestore';
import { db, rDb } from '../config/firebase.config';
import { login, logout } from '../store/reducers/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import useToast from './useToast';
import { changeStatus } from '../store/reducers/contextMenu/ContextMenuSlice';
import { IUser } from '../interfaces';
import useStorage from './useStorage';
import { selectSettings } from '../store/reducers/settings/settingsSlice';

const useInit = () => {
    const auth = getAuth();
    const dispatch = useDispatch();
    const toast = useToast();
    const { setStorage } = useStorage();
    const { theme } = useSelector(selectSettings);

    // --- lithen for theme chnages and apply
    useEffect(() => {
        if (theme.darkMode) {
            document.body.classList.add('dark');
            setStorage('youMessage-theme', { darkMode: true });
            return;
        }
        document.body.classList.remove('dark');
        setStorage('youMessage-theme', { darkMode: false });
    }, [theme]);

    useEffect(() => {
        // --- Initialize auth and check user auth status ---
        const unSubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                onSnapshot(doc(db, 'users', user.uid), { includeMetadataChanges: true }, (snapShot) => {
                    dispatch(login(snapShot.data() as IUser));
                    checkUserPresence(snapShot.data() as IUser);
                });
            } else {
                dispatch(logout());
            }
        });

        // --- set darkMode for initial open

        return unSubscribe;
    }, []);

    const checkUserPresence = (user: IUser) => {
        // --- update user prescene ---
        const connectedRef = ref(rDb, '.info/connected');
        onValue(connectedRef, async (snapShot) => {
            if (!snapShot.val()) {
                return;
            }
            const rUserRef = ref(rDb, '/status/' + user.uid);
            onDisconnect(rUserRef)
                .set({ timeStamp: serverTimestamp(), isOnline: false }) // --- set if user goas ofline
                .then(async () => {
                    // --- set if user goas online ---
                    set(rUserRef, { timeStamp: serverTimestamp(), isOnline: true });
                });
        });
    };

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
