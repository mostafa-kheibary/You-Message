import { FC, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LinearProgress } from '@mui/material';
import iconImage from '../../assets/image/icon.png';
import './Loading.css';

const Loading: FC = () => {
  useEffect(() => {
    return () => {};
  }, []);
  return (
    <motion.div className='loading-page'>
      <motion.div
        initial={{ opacity: 0, scale: 1.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        className='loading-page__content'
      >
        <img className='loading-page__icon' src={iconImage} alt='icon' />
        <LinearProgress className='loading-page__progress' />
      </motion.div>
    </motion.div>
  );
};

export default Loading;
