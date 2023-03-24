import { useInitState, useMaster } from '@/hooks';
import { Outlet } from '@umijs/max';

export default function Layout() {
  const { initialState, setInitialState } = useInitState();
  const { masterState } = useMaster();

  if (masterState?.settings?.navTheme) {
    const settings = {
      ...initialState?.settings,
      navTheme: masterState?.settings?.navTheme,
    };
    setInitialState({
      ...initialState,
      settings,
    });
  }

  return <Outlet />;
}
