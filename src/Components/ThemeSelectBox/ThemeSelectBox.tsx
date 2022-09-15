import { FC, MouseEvent } from 'react';
import classNames from '../../utils/classNames';
import './ThemeSelectBox.css';

interface IProps {
    themeData: { dark: boolean; title: string };
    select: boolean;
    onClick: (e: MouseEvent) => any;
}
const ThemeSelectBox: FC<IProps> = ({ themeData, onClick, select }) => {
    return (
        <div
            onClick={onClick}
            className={classNames('theme-select-box', themeData.dark ? 'dark' : 'light', select ? 'select' : '')}
        >
            <div className='theme-select-box__message reciver'>{themeData.title}</div>
            <div className='theme-select-box__message owner'>{themeData.title}</div>
        </div>
    );
};

export default ThemeSelectBox;
