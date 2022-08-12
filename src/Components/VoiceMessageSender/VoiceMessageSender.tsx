import { FC } from 'react';

import { IconButton } from '@mui/material';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';

const VoiceMessageSender: FC = () => {
  return (
    <IconButton size='large' className='input-bar__send' color='primary'>
      <KeyboardVoiceIcon />
    </IconButton>
  );
};

export default VoiceMessageSender;
