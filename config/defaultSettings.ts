import { ProLayoutProps } from '@ant-design/pro-components';

/**
 * @name
 */
export default {
  // pure: true,
  title: '业务系统',
  // // 头部是否显示
  // headerRender: false,
  // // 页脚是否显示
  // footerRender: false,
  // // 菜单是否显示
  // menuRender: false,
  // // 菜单头是否显示
  // menuHeaderRender: false,
  token: {
    // 参见ts声明，demo 见文档，通过token 修改样式
    //https://procomponents.ant.design/components/layout#%E9%80%9A%E8%BF%87-token-%E4%BF%AE%E6%94%B9%E6%A0%B7%E5%BC%8F
  },
} as ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
};
