import { useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../config/firebase.config';
import { addMessages, deleteMessage, editMessage } from '../store/reducers/message/messageSlice';
import { IMessage, IUser } from '../types/stateTypes';
import { login, logout } from '../store/reducers/user/userSlice';
import { useDispatch } from 'react-redux';
import useToast from './useToast';

const useInit = () => {
  const auth = getAuth();
  const dispatch = useDispatch();
  const toast = useToast();

  // Initialize auth and check user auth status
  useEffect(() => {
    console.log('run');
    const unSubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        getInitialsMessages(user.uid);
        onSnapshot(doc(db, 'users', user.uid), (snapShot) => {
          dispatch(login(snapShot.data() as IUser));
        });
      } else {
        dispatch(logout());
      }
    });
    return () => unSubscribe();
  }, []);

  // get all contact and messgae related to each contact
  const getInitialsMessages = (userId: string) => {
    if (!userId) {
      return;
    }
    const userRef = doc(db, 'users', userId);
    const messagesQuery = query(collection(db, 'messages'), where('from', '==', userRef));
    onSnapshot(messagesQuery, (snapShot) => {
      snapShot.docChanges().forEach((itemSnap) => {
        switch (itemSnap.type) {
          case 'added':
            dispatch(addMessages(itemSnap.doc.data() as IMessage));
            break;
          case 'modified':
            dispatch(editMessage({ id: itemSnap.doc.id, message: itemSnap.doc.data() }));
            break;
          case 'removed':
            dispatch(deleteMessage(itemSnap.doc.id));
            break;
        }
      });
    });
  };

  const registerEvent = () => {
    window.addEventListener('offline', () => toast('No internet! you are offline', 'error'));
    window.addEventListener('online', () => toast('Internet is back! you are online', 'success'));
    window.addEventListener('contextmenu', (e) => e.preventDefault());
  };
  const init = (): void => {
    registerEvent();
  };
  return init;
};

export default useInit;
