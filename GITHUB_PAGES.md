# 吃点啥：GitHub Pages 发布与安卓安装说明

这个仓库已经准备好 GitHub Pages 自动发布配置。网页文件位于 `github-pages`，每次向 `main` 分支提交后，GitHub 会自动发布最新版本。

## 第一次发布

1. 在 GitHub 新建一个空仓库，例如 `what-to-eat-today`。
2. 把本项目的全部文件上传到仓库，并确保默认分支名为 `main`。
3. 打开仓库的 `Settings` → `Pages`。
4. 在 `Build and deployment` 的 `Source` 中选择 `GitHub Actions`。
5. 打开仓库的 `Actions` 页面，等待 `Deploy Android PWA to GitHub Pages` 运行完成。
6. 发布地址通常是 `https://你的用户名.github.io/仓库名/`。GitHub Pages 设置页和工作流结果中也会显示准确地址。

## 安装到安卓手机

1. 用安卓手机的 Chrome 打开发布地址。
2. 第一次打开时保持联网，等待页面加载完成。
3. 点击网页顶部出现的“安装到手机”，或打开 Chrome 菜单，选择“安装应用 / 添加到主屏幕”。
4. 安装后可以像普通应用一样从桌面打开；首次完整加载后，断网也能继续随机抽取和浏览 80 种食物。

## 后续更新

只需修改 `github-pages` 中的文件并提交到 `main` 分支，GitHub Actions 会自动重新发布。若手机暂时仍显示旧版本，关闭后重新打开一次即可完成缓存更新。

## 隐私与数据

- 不接入店铺、外卖或推荐网站。
- 不请求账号、定位和通讯录权限。
- 抽取历史只保存在当前设备的浏览器中。
- 所有食物数据均随网页一同发布，可离线使用。
