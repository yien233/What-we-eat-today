# 吃点啥｜今天吃什么

一个帮助用户随机决定“今天吃什么”的小程序。内置 80 种平价、常见、可即食的食物类型，支持类别与预算筛选，不接入具体店铺、外卖平台或推荐网站。

## 三个独立版本

| 版本 | 目录 | 使用方式 |
| --- | --- | --- |
| 网页版 | [`versions/web`](./versions/web) | 上传到任意静态托管服务后访问 |
| PC 端本地版 | [`versions/pc-offline`](./versions/pc-offline) | Windows 双击启动文件或直接打开 HTML |
| 安卓端本地版 | [`versions/android-pwa`](./versions/android-pwa) | 通过 HTTPS 打开并安装到安卓主屏幕，之后可离线使用 |

三个版本对应的独立压缩包位于 [`release-packages`](./release-packages)。

## GitHub Pages

本仓库会通过 GitHub Actions 自动发布安卓 PWA 版本。它同时可以作为普通响应式网页使用。完整操作见 [`GITHUB_PAGES.md`](./GITHUB_PAGES.md)。

## 开发版源码

仓库根目录中的 `app`、`components`、`hooks`、`lib`、`public` 及相关配置文件是 React/Vinext 开发版源码。开发版与三个免构建发布包分开保留，便于继续维护界面与功能。

## 功能与隐私

- 80 种食物，覆盖面食、米饭、粉汤饺子、西式快餐、街头小吃、热锅、轻食与异国风味
- 支持类别、预算筛选和最近抽取记录
- 不请求账号、定位或通讯录权限
- 抽取记录仅保存在当前设备
- 不提供具体餐厅、商家或外卖链接
