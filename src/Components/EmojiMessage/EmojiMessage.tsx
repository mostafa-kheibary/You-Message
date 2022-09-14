import { ChangeEvent, FC, ReactNode, useMemo, useState } from 'react';
import emojisData from '../../data/emojies.json';

import { IconButton, Input } from '@mui/material';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import PetsIcon from '@mui/icons-material/Pets';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import SportsHandballIcon from '@mui/icons-material/SportsHandball';
import EmojiFlagsIcon from '@mui/icons-material/EmojiFlags';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import classNames from '../../utils/classNames';
import './EmojiMessage.css';
import { useDispatch } from 'react-redux';
import { addMessageInput } from '../../store/reducers/messageInput/messageInputSlice';

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

const EmojiMessage: FC = () => {
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>('');
    const [currentCatagory, setCurrentCatagory] = useState<emojiType>('Smileys & Emotion');
    const [emojis, setEmojis] = useState<any[]>([]);
    const [filterdEmoji, setFilterdEmoji] = useState<any[]>([]);

    const catagorys: ICatagory[] = [
        { name: 'Smileys & Emotion', icon: <TagFacesIcon /> },
        { name: 'People & Body', icon: <ThumbUpAltIcon /> },
        { name: 'Animals & Nature', icon: <PetsIcon /> },
        { name: 'Food & Drink', icon: <ThumbUpAltIcon /> },
        { name: 'Travel & Places', icon: <FastfoodIcon /> },
        { name: 'Activities', icon: <SportsHandballIcon /> },
        { name: 'Objects', icon: <EmojiObjectsIcon /> },
        { name: 'Flags', icon: <EmojiFlagsIcon /> },
    ];
    const handleOpenTab = (): void => {
        setIsOpen(true);
    };
    const handleCloseTab = (): void => {
        setIsOpen(false);
    };
    const addEmoji = (emoji: string) => {
        dispatch(addMessageInput(emoji));
    };
    const handleSearchEmoji = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
        const searchTerm = e.target.value.trim();
        const filterd = emojis.filter((emoji) => emoji.description.includes(searchTerm));
        console.log(filterd);
        setFilterdEmoji(filterd);
    };
    useMemo(() => {
        const filterd = emojisData.filter((emoji) => emoji.category === currentCatagory);
        setEmojis(filterd);
        setFilterdEmoji(filterd);
    }, [currentCatagory]);

    const renderedEmojis = useMemo(() => {
        return filterdEmoji.map((emoji: any, i: number) => (
            <span className='emoji__select-tab__emoji' key={i} onClick={() => addEmoji(emoji.emoji)}>
                {emoji.emoji}
            </span>
        ));
    }, [filterdEmoji]);

    return (
        <div onMouseLeave={handleCloseTab} className='emoji-sender'>
            <IconButton className='emoji-sender__button' onClick={handleOpenTab} size='medium'>
                <EmojiEmotionsIcon />
            </IconButton>
            <div className={classNames('emoji__select-tab', isOpen ? 'open' : '')}>
                <div className='emoji__select-tab__search-head'>
                    <Input
                        value={searchValue}
                        onChange={handleSearchEmoji}
                        placeholder='Search Emoji'
                        className='emoji__select-tab__search-input'
                    />
                </div>
                <div className='emoji__select-tab__wrapper'>{renderedEmojis}</div>
                {filterdEmoji.length <= 0 && <h4 className='emoji__select__not-found'>Emoji Not Found</h4>}
                <div className='emoji__select-tab__bottom'>
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
            </div>
        </div>
    );
};

export default EmojiMessage;
