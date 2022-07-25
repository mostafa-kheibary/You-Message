import { Backdrop, CircularProgress } from '@mui/material';
import { FC } from 'react';
interface IProps {
  isLoading: boolean;
}
const Loader: FC<IProps> = ({ isLoading }) => {
  return (
    <Backdrop open={isLoading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <CircularProgress color='inherit' />
    </Backdrop>
  );
};

export default Loader;
