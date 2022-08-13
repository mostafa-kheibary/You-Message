import { useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, doc, enableIndexedDbPersistence, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../config/firebase.config';
import { IUser, login, logout } from '../store/reducers/user/userSlice';
import { useDispatch } from 'react-redux';
import useToast from './useToast';
import {
  addConversation,
  editConversation,
  IConversation,
  removeConversation,
} from '../store/reducers/conversations/conversationsSlice';

const useInit = () => {
  const auth = getAuth();
  const dispatch = useDispatch();
  const toast = useToast();

  // Initialize auth and check user auth status
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        getInitialsConversations(user.uid);
        console.log(user.uid);
        onSnapshot(doc(db, 'users', user.uid), { includeMetadataChanges: true }, (snapShot) => {
          dispatch(login(snapShot.data() as IUser));
        });
      } else {
        dispatch(logout());
      }
    });
    return () => unSubscribe();
  }, []);

  // get all contact and messgae related to each contact
  const getInitialsConversations = (userId: string) => {
    if (!userId) {
      return;
    }
    const userRef = doc(db, 'users', userId);
    const messagesQuery = query(collection(db, 'conversations'), where('owners', 'array-contains', userRef));
    onSnapshot(messagesQuery, { includeMetadataChanges: true }, (snapShot) => {
      snapShot.docChanges().forEach((itemSnap) => {
        switch (itemSnap.type) {
          case 'added':
            dispatch(addConversation(itemSnap.doc.data() as IConversation));
            break;
          case 'modified':
            dispatch(editConversation({ id: itemSnap.doc.id, message: itemSnap.doc.data() }));
            break;
          case 'removed':
            dispatch(removeConversation(itemSnap.doc.id));
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
    enableIndexedDbPersistence(db);
    registerEvent();
  };
  return init;
};

export default useInit;
