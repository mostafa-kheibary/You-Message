import { Avatar } from '@mui/material';
import { FC, MouseEventHandler } from 'react';

interface IProps {
    name: string;
    src: string;
    color: string;
    className?: string;
    onClick?: () => MouseEventHandler;
}

const ProfileAvatar: FC<IProps> = ({ name, src, className, color, onClick }) => {
    return src.trim() !== '' ? (
        <Avatar onClick={onClick} src={src} className={className} />
    ) : (
        <Avatar onClick={onClick} className={className} sx={{ background: color }}>
            {name.split(' ').map((char) => char.charAt(0).toUpperCase())}
        </Avatar>
    );
};

export default ProfileAvatar;
