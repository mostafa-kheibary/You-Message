import { FC, Fragment } from 'react';
import { IconButton, Snackbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import classNames from '../../utils/classNames';
import { useDispatch, useSelector } from 'react-redux';
import { selectToast, setVisibility } from '../../store/reducers/toast/toastSlice';
import './Toast.css';

const Toast: FC = () => {
  const dispatch = useDispatch();
  const { message, status, visibility } = useSelector(selectToast);

  const handleClose = () => {
    dispatch(setVisibility(false));
  };
  const action = (
    <Fragment>
      <IconButton size='small' aria-label='close' color={status} onClick={handleClose}>
        <CloseIcon fontSize='small' />
      </IconButton>
    </Fragment>
  );
  return (
    <Snackbar
      autoHideDuration={800}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      className={classNames('toast-bar', status)}
      action={action}
      open={visibility}
      message={message}
    />
  );
};

export default Toast;
