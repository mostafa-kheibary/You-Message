import { FC, useEffect } from 'react';

import { IconButton } from '@mui/material';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import useAudio from '../../hook/useAudio';

const VoiceMessageSender: FC = () => {
    const { audioChunk, isRecourding, recourd, puase } = useAudio();
    const handleClick = () => {
        if (!isRecourding) {
            recourd();
        } else {
            puase();
        }
    };
    useEffect(() => {
        if (!isRecourding) {
            const audioBlob = new Blob(audioChunk);
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.play();
            console.log(audioChunk);
        }
    }, [isRecourding]);
    return (
        <IconButton onClick={handleClick} size='large' className='input-bar__send' color='primary'>
            {isRecourding ? '=' : <KeyboardVoiceIcon />}
        </IconButton>
    );
};

export default VoiceMessageSender;
