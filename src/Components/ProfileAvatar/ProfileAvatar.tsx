import { Avatar } from '@mui/material';
import { FC } from 'react';

interface IProps {
    name: string;
    src: string;
    className?: string;
    color: string;
}

const ProfileAvatar: FC<IProps> = ({ name, src, className, color }) => {
    return src.trim() !== '' ? (
        <Avatar src={src} className={className} />
    ) : (
        <Avatar className={className} sx={{ background: color }}>
            {name.split(' ').map((char) => char.charAt(0).toUpperCase())}
        </Avatar>
    );
};

export default ProfileAvatar;
