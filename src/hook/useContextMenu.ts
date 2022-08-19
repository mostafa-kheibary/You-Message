import { useDispatch, useSelector } from 'react-redux';
import { selectContextMenu, setContextMenus, changeStatus } from '../store/reducers/contextMenu/ContextMenuSlice';
const useContextMenu = () => {
  const dispatch = useDispatch();
  const { open } = useSelector(selectContextMenu);

  const changeContextMenus = (data: any) => {
    dispatch(setContextMenus(data));
  };
  const openContext = () => {
    if (!open) {
      dispatch(changeStatus(true));
    }
  };
  return { openContext, changeContextMenus };
};
export default useContextMenu;
