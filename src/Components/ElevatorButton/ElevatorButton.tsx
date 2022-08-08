import { FC, useEffect, useState } from 'react';
import { IconButton } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import './ElevatorButton.css';
import classNames from '../../utils/classNames';

interface IProps {
  containerRef: HTMLDivElement | null;
}
const ElevatorButton: FC<IProps> = ({ containerRef }) => {
  const [isShow, setIshow] = useState<boolean>(false);

  useEffect(() => {
    if (!containerRef) return;
    const unsub = containerRef.addEventListener('scroll', () => {
      if (containerRef.scrollHeight - containerRef.offsetHeight - 200 >= containerRef.scrollTop) {
        setIshow(true);
      } else {
        setIshow(false);
      }
    });
    return unsub;
  }, [containerRef]);

  const goToButton = () => {
    containerRef?.scrollTo({ left: 0, top: containerRef.scrollHeight, behavior: 'smooth' });
  };
  return (
    <IconButton onClick={goToButton} size='large' className={classNames('elevator-button', isShow ? 'show' : '')}>
      <KeyboardArrowDownIcon />
    </IconButton>
  );
};

export default ElevatorButton;
