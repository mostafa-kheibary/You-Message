import React, { FC, ReactNode, useMemo, useState } from 'react';
import emojisData from '../../data/emojies.json';

import { IconButton } from '@mui/material';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import classNames from '../../utils/classNames';
import './EmojiMessage.css';

type emojiType =
  | 'Smileys & Emotion'
  | 'People & Body'
  | 'Animals & Nature'
  | 'Food & Drink'
  | 'Travel & Places'
  | 'Activities'
  | 'Objects'
  | 'Flags';

interface ICatagory {
  name: emojiType;
  icon: ReactNode;
}
interface IProps {
  addEmojis: (emoji: string) => void;
}

const EmojiMessage: FC<IProps> = ({ addEmojis }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentCatagory, setCurrentCatagory] = useState<emojiType>('Smileys & Emotion');
  const [emojis, setEmojis] = useState<any>([]);

  const catagorys: ICatagory[] = [
    { name: 'Smileys & Emotion', icon: <TagFacesIcon /> },
    { name: 'People & Body', icon: <ThumbUpAltIcon /> },
    { name: 'Animals & Nature', icon: <ThumbUpAltIcon /> },
    { name: 'Food & Drink', icon: <ThumbUpAltIcon /> },
    { name: 'Travel & Places', icon: <ThumbUpAltIcon /> },
    { name: 'Activities', icon: <ThumbUpAltIcon /> },
    { name: 'Objects', icon: <ThumbUpAltIcon /> },
    { name: 'Flags', icon: <ThumbUpAltIcon /> },
  ];
  const handleOpenTab = (): void => {
    setIsOpen(true);
  };
  const handleCloseTab = (): void => {
    setIsOpen(false);
  };
  useMemo(() => {
    setEmojis(emojisData.filter((emoji) => emoji.category === currentCatagory));
  }, [currentCatagory]);

  const renderedEmojis = useMemo(() => {
    return emojis.map((emoji: any, i: number) => (
      <span className='emoji__select-tab__emoji' key={i} onClick={() => addEmojis(emoji.emoji)}>
        {emoji.emoji}
      </span>
    ));
  }, [emojis]);

  return (
    <div onMouseLeave={handleCloseTab} className='emoji-sender'>
      <IconButton className='emoji-sender__button' onClick={handleOpenTab} size='medium'>
        <EmojiEmotionsIcon />
      </IconButton>
      <div className={classNames('emoji__select-tab', isOpen ? 'open' : '')}>
        <div className='emoji__select-tab__head'>
          {catagorys.map((catagory, i) => (
            <IconButton
              color={catagory.name === currentCatagory ? 'primary' : 'default'}
              size='small'
              key={i}
              onClick={() => setCurrentCatagory(catagory.name)}
            >
              {catagory.icon}
            </IconButton>
          ))}
        </div>
        <div className='emoji__select-tab__wrapper'>{renderedEmojis}</div>
      </div>
    </div>
  );
};

export default EmojiMessage;
