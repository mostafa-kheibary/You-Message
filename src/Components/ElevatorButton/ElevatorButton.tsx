import { FC, useEffect, useState } from 'react';
import { IconButton } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import classNames from '../../utils/classNames';
import { useSelector } from 'react-redux';
import { selectCurrentConversation } from '../../store/reducers/conversations/conversationsSlice';
import './ElevatorButton.css';

interface IProps {
    containerRef: HTMLDivElement | null;
    unreadCount: number;
}
const ElevatorButton: FC<IProps> = ({ containerRef, unreadCount }) => {
    const { id } = useSelector(selectCurrentConversation);
    const [isShow, setIshow] = useState<boolean>(false);

    useEffect(() => {
        if (!containerRef) return;
        const unsub = containerRef.addEventListener('scroll', () => {
            checkForShow();
        });
        return unsub;
    }, [id]);

    const checkForShow = () => {
        if (!containerRef) return;

        if (containerRef.scrollHeight - containerRef.offsetHeight - 50 >= containerRef.scrollTop) {
            setIshow(true);
        } else {
            setIshow(false);
        }
    };

    const goToButton = () => {
        containerRef?.scrollTo({ left: 0, top: containerRef.scrollHeight, behavior: 'smooth' });
    };
    return (
        <IconButton onClick={goToButton} size='large' className={classNames('elevator-button', isShow ? 'show' : '')}>
            <KeyboardArrowDownIcon />
            {unreadCount > 0 && <span className='elevator-button__unread-count'>{unreadCount}</span>}
        </IconButton>
    );
};

export default ElevatorButton;
