import { FC } from 'react';

import { IconButton, OutlinedInput } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import './InputBar.css';

const InputBar: FC = () => {
  return (
    <div className='input-bar'>
      <OutlinedInput className='input-bar__input' placeholder='Your message ...' />
      <div className='input-bar__buttons'>
        <IconButton color='primary'>
          <SendIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default InputBar;
