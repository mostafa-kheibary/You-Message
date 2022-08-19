import { Avatar, Button, Skeleton } from '@mui/material';
import { getAuth } from 'firebase/auth';
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, Timestamp } from 'firebase/firestore';
import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { db } from '../../config/firebase.config';
import useContextMenu from '../../hook/useContextMenu';
import {
  changeOpenStatus,
  IConversation,
  selectCurrentConversation,
  setCurrentConversation,
} from '../../store/reducers/conversations/conversationsSlice';
import { IMessage } from '../../store/reducers/message/messageSlice';
import DeleteIcon from '@mui/icons-material/Delete';
import { IUser, selectUser } from '../../store/reducers/user/userSlice';
import classNames from '../../utils/classNames';
import './ConversationCard.css';

interface IProps {
  messageData: IConversation;
}
const ConversationCard: FC<IProps> = ({ messageData }) => {
  const [toUser, setToUser] = useState<IUser | null>(null);
  const [unReadMessage, setUnReadMessage] = useState<number>(0);
  const [lastMessage, setLastMessage] = useState<IMessage | null>(null);
  const { info } = useSelector(selectUser);
  const currentConversation = useSelector(selectCurrentConversation);
  const { changeContextMenus, openContext } = useContextMenu();
  const auth = getAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!auth.currentUser) return;
    if (messageData.owners[0].id === auth.currentUser.uid) {
      onSnapshot(messageData.owners[1], (snapShot) => {
        setToUser(snapShot.data() as IUser);
      });
    } else {
      onSnapshot(messageData.owners[0], (snapShot) => {
        setToUser(snapShot.data() as IUser);
      });
    }
    getLastMessage();
  }, []);

  const getLastMessage = async () => {
    const messageRef = query(collection(db, 'conversations', messageData.id, 'messages'), orderBy('timeStamp', 'asc'));
    onSnapshot(messageRef, (snapShot) => {
      if (!snapShot.empty) {
        setLastMessage(snapShot.docs[snapShot.docs.length - 1].data() as IMessage);
        const unread = snapShot.docs.filter(
          (message) => message.data().status === 'sent' && message.data().owner !== info!.uid
        );
        setUnReadMessage(unread.length);
      }
    });
  };

  const handleOpenChat = () => {
    if (!toUser) {
      return;
    }
    dispatch(setCurrentConversation({ id: messageData.id, toUser }));
    dispatch(changeOpenStatus(true));
  };
  const deleteConversation = async () => {
    deleteDoc(doc(db, 'conversations', messageData.id));
    if (currentConversation.id === messageData.id) {
      dispatch(setCurrentConversation({ toUser: null, id: '' }));
    }
  };

  const handleRightClick = () => {
    changeContextMenus([{ icon: <DeleteIcon />, name: 'Delete', function: deleteConversation }]);
    openContext();
  };

  if (!toUser) {
    return (
      <div className='conversation-card__skeleton'>
        <div className='conversation-card__skeleton__avatar'>
          <Skeleton variant='circular' width={40} height={40} animation='pulse' />
        </div>
        <div className='conversation-card__skeleton__texts'>
          <Skeleton variant='text' width='100%' height={20} animation='pulse' />
          <Skeleton variant='text' width='80%' height={15} animation='pulse' />
        </div>
      </div>
    );
  }
  return (
    <Button
      color='inherit'
      autoCapitalize='off'
      onClick={handleOpenChat}
      onContextMenu={handleRightClick}
      className={classNames('conversation-card', toUser.uid === currentConversation.toUser?.uid ? 'active' : '')}
    >
      <div className='conversation-card__content'>
        <Avatar className='conversation-card__avatar' src={toUser.avatar} />
        <div className='conversation-card__info'>
          <h4 className='conversation-card__user-name'>{toUser.userName}</h4>
          <p className='conversation-card__last-message'>{lastMessage?.text || 'conversation started'}</p>
        </div>
        <div className='conversation-card__status'>
          <h5 className='conversation-card__last-seen'>
            {new Timestamp(toUser.lastSeen.seconds, toUser.lastSeen.nanoseconds).toDate().toLocaleTimeString()}
          </h5>
          {unReadMessage > 0 && <h5 className='conversation-card__notif'>{unReadMessage}</h5>}
        </div>
      </div>
    </Button>
  );
};

export default ConversationCard;
