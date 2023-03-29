import Footer from '@/components/Footer';
import UnAccessible from '@/pages/exception/403';
import { InitialStateType } from '@@/plugin-initialState/@@initialState';
import {
  PageLoading,
  SettingDrawer,
  Settings as LayoutSettings
} from '@ant-design/pro-components';
import { AvatarDropdown, AvatarName } from '@c/RightContent/AvatarDropdown';
import { RunTimeLayoutConfig } from '@umijs/max';
import { cloneDeep } from 'lodash';
import defaultSettings from '../config/defaultSettings';
import initMenuData from './initMenuData.mock';
import { errorConfig } from './requestErrorConfig';
// const isDev = process.env.NODE_ENV === 'development';
// const loginPath = '/user/login';
let masterConfig:
  | API.useQiankunStateForSlaveReturnProps<InitialStateType>
  | undefined;
/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  loading?: boolean;
}> {
  let masterSettings:
    | (Partial<LayoutSettings> & Record<string, any>)
    | undefined;

  if (masterConfig) {
    masterSettings = {
      pure: true,
      colorPrimary: masterConfig?.masterState?.settings?.colorPrimary,
      navTheme: masterConfig?.masterState?.settings?.navTheme,
    };
  }

  return {
    settings: {
      ...defaultSettings,
      ...masterSettings,
    } as Partial<LayoutSettings>,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({
  initialState,
  setInitialState,
}) => {
  return {
    waterMarkProps: {
      content: '水印',
    },

    avatarProps: {
      src: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },
    menu: {
      params: { initMenuData },
      request: async ({ initMenuData }) => {
        return cloneDeep(initMenuData) || []; //为什么这儿要用深拷贝？因为不同的uim版本会导致我丢给他的对象内部属性children变成router 所以用深度拷贝单独给他一个对象
      },
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      if (masterConfig) {
        return;
      }
    },
    unAccessible: <UnAccessible />,
    childrenRender: (children) => {
      if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {/* 动态主题设置 */}
          <SettingDrawer
            disableUrlParams
            enableDarkTheme
            settings={initialState?.settings}
            onSettingChange={(settings) => {
              setInitialState((preInitialState) => ({
                ...preInitialState,
                settings,
              }));
            }}
          />
        </>
      );
    },
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = {
  ...errorConfig,
};

export const qiankun = {
  // 应用加载之前
  async bootstrap(
    props: API.useQiankunStateForSlaveReturnProps<InitialStateType>,
  ) {
    masterConfig = props;
    console.log('app1 bootstrap', props);
  },
  // 应用 render 之前触发
  async mount(props: API.useQiankunStateForSlaveReturnProps<InitialStateType>) {
    console.log('app1 mount', props);
  },
  // 应用卸载之后触发
  async unmount(
    props: API.useQiankunStateForSlaveReturnProps<InitialStateType>,
  ) {
    console.log('app1 unmount', props);
  },
};
