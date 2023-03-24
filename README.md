# README

`@umijs/max` 模板项目，更多功能参考 [Umi Max 简介](https://umijs.org/docs/max/introduce)

## 系统级子应用责任范围说明（前提：此子系统能独立于主应用运行）
- 有自己的登录体系
- 有自己的菜单路由体系
- 有自己的样式主题体系
- 能响应主应用的样式同步
- 能处理主应用的数据同步
- 负责业务页面的实现
## 功能子应用子应用责任范围说明（例如：网页右下角嵌入聊天系统）
- 保证父子应用的数据同步和UI同步
## 子应用功能点说明
- 样式同步在src/layout.tsx文件中通过hooks useModel('@@qiankunStateFromMaster') 
  - 色彩主题在此处处理
  - 子应用的菜单栏的是否显示可在此处,通过useModel('@@qiankunStateFromMaster') 进行复验和矫正(可选)
- 数据同步根据具体业务和时机具体处理
- 菜单栏的是否显示也可在app.ts/layout,通过url或localstorage判断是否显示