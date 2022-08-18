import { FC, useEffect, useRef, useState } from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { changeStatus, selectContextMenu } from '../../store/reducers/contextMenu/ContextMenu';
import './ContextMenu.css';

const ContextMenu: FC = () => {
  const { open, menu } = useSelector(selectContextMenu);
  const [location, setLocation] = useState<any>({ top: -1000, left: -1000 });
  const contextMenuRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsub = window.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      if (!contextMenuRef.current) return;
      setLocation({
        top:
          window.innerHeight <= e.pageY + contextMenuRef.current.clientHeight
            ? e.pageY - contextMenuRef.current.clientHeight + 20
            : e.pageY - 20,
        left:
          window.innerWidth <= e.pageX + contextMenuRef.current.clientWidth
            ? e.pageX - contextMenuRef.current.clientWidth + 20
            : e.pageX - 20,
      });
    });
    return unsub;
  }, []);

  return (
    <motion.div
      ref={contextMenuRef}
      animate={open ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
      className='context-menu'
      style={location}
      onMouseMove={() => dispatch(changeStatus(true))}
      onMouseOut={() => dispatch(changeStatus(false))}
    >
      <List onClick={() => setTimeout(() => dispatch(changeStatus(false)), 150)} className='context-menu__list'>
        {menu.map((contextItem, i) => (
          <ListItemButton key={i} onClick={contextItem.function}>
            {contextItem.name}
          </ListItemButton>
        ))}
      </List>
    </motion.div>
  );
};

export default ContextMenu;
