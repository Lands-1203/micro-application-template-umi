import { useModel } from '@umijs/max';
export const useInitState = () => {
  const initialState = useModel('@@initialState') || {};
  return initialState;
};
