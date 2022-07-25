import { useDispatch, useSelector } from 'react-redux';
import { selectToast, setToast, setVisibility } from '../store/reducers/toast/toastSlice';

const useToast = () => {
  const dispatch = useDispatch();
  const { visibility } = useSelector(selectToast);

  const toast = (message: string, status: 'success' | 'error'): void => {
    if (!visibility) {
      dispatch(setToast({ message: message, status: status, visibility: true }));
    } else {
      dispatch(setVisibility(false));
    }
    setTimeout(() => {
      dispatch(setVisibility(false));
    }, 2000);
  };
  return toast;
};

export default useToast;
