import { createPortal } from 'react-dom';
import { IconButton } from '@mui/material';
import { FC, Key, ReactNode, useMemo } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { AnimatePresence, motion, TargetAndTransition, Variant } from 'framer-motion';
import './Modal.css';

interface IProps {
    isOpen: boolean;
    children: ReactNode;
    handleClose: () => void;
}
const Modal: FC<IProps> = ({ isOpen, handleClose, children }) => {
    const modalVarient: any = {
        show: {
            scale: 1,
            opacity: 1,
        },
        hidden: {
            scale: 0.5,
            opacity: 0,
        },
    };

    const backDropVarient: any = {
        show: {
            opacity: 1,
        },
        hidden: {
            opacity: 0,
        },
    };

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        variants={backDropVarient}
                        initial='hidden'
                        animate='show'
                        exit='hidden'
                        onClick={handleClose}
                        className='modal-backdrop'
                    ></motion.div>
                    <motion.div
                        variants={modalVarient}
                        initial='hidden'
                        animate='show'
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{
                            opacity: { duration: 0.2 },
                            scale: { type: 'spring', bounce: 0.3, duration: 0.4 },
                        }}
                        className='modal'
                    >
                        <IconButton className='modal__close-button' onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                        {children}
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.getElementById('modal-portal') as HTMLDivElement
    );
};

export default Modal;
