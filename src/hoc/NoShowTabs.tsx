import { GLOBAL_EVENT } from '@/event';
import { useEffect } from 'react';

export default (Componet: React.FC<any>) => {
  useEffect(() => {
    GLOBAL_EVENT.emit('showGlobalTabBar', false);
    return () => {
      GLOBAL_EVENT.emit('showGlobalTabBar', true);
    };
  }, []);
  return <Componet />;
};
