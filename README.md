# README

`@umijs/max` 模板项目，更多功能参考 [Umi Max 简介](https://umijs.org/docs/max/introduce)

## 系统级子应用责任范围说明（前提：此子系统能独立于主应用运行）

- 有自己的登录体系
- 有自己的菜单路由体系
- 有自己的样式主题体系
- 能响应主应用的样式同步
- 能处理主应用的数据同步
- 负责业务页面的实现
- 负责面包屑的自定义实现

## 功能子应用子应用责任范围说明（例如：网页右下角嵌入聊天系统）

- 保证父子应用的数据同步和 UI 同步

## 子应用功能点说明

- 样式同步在 src/layout.tsx 文件中通过 hooks useModel('@@qiankunStateFromMaster')
  - 色彩主题在此处处理
  - 子应用的菜单栏的是否显示可在此处,通过 useModel('@@qiankunStateFromMaster') 进行复验和矫正(可选)
- 初始化数据在 app.tsx 中使用全局变量接受生命周期中主应用的状态。
- 数据同步根据具体业务和时机具体处理
- 菜单栏的是否显示也可在 app.ts/layout,通过 url 或 localstorage 判断是否显示
- 子应用需要实现自己的面包屑（可选），如果不自定义实现：面包屑的第一级会根据菜单的第二级开始显示。原因：ProLayout是主应用中的，PageContainer是子应用中的，完整结构是  master ProLayout -> micro ProLayout(UI隐藏了，但是功能还在) -> micro PageContainer
