import { InitialStateType } from '@@/plugin-initialState/@@initialState';
import { useModel } from '@umijs/max';
export const useMaster = () => {
  const masterData: API.useQiankunStateForSlaveReturnProps<InitialStateType> =
    useModel('@@qiankunStateFromMaster') || {};
  return masterData;
};
