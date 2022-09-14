import { useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { onDisconnect, onValue, ref, set, serverTimestamp } from 'firebase/database';
import { doc, enableIndexedDbPersistence, onSnapshot } from 'firebase/firestore';
import { db, rDb } from '../config/firebase.config';
import { login, logout } from '../store/reducers/user/userSlice';
import { useDispatch } from 'react-redux';
import useToast from './useToast';
import { changeStatus } from '../store/reducers/contextMenu/ContextMenuSlice';
import { IUser } from '../interfaces';

const useInit = () => {
    const auth = getAuth();
    const dispatch = useDispatch();
    const toast = useToast();

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
