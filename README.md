# 基于vue3的仿bilibili前端

## 项目介绍

本项目是基于vue3的仿bilibili前端，使用vue3全家桶+typescript+element-plus+axios+vue-router+vuex+sass+webpack等技术开发，实现了bilibili首页、登录、注册、视频详情页、个人中心、视频上传等功能。

## 项目启动方法

### 安装依赖

```sh
pnpm install
```

### 安装openapi

```sh
pnpm add openapi-typescript-codegen --save-dev
```

### 导入后端接口

**首先启动后端主程序**

```sh
openapi --input http://localhost:8080/v2/api-docs?group=ailiaili --output ./generated --client axios
```

### 添加必要的依赖

```sh
pnpm add form-data

pnpm add axios

pnpm add jsencrypt sass sass-loader
```

### 自行申请腾讯云的tcplayer许可

替换BilibiliVideo.vue中的：

```html
licenseUrl: 'https://',
```

## 贡献

由于项目是为了完成课程作业而设计，存在诸多bug。欢迎贡献代码，请遵循现有代码风格并通过单元测试。
