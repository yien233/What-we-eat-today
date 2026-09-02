# 吃点啥｜Android APK

这是独立安装的安卓应用，不是 PWA。完整菜单、脚本、样式和图片打包在 APK 中，首次打开也能离线使用。

## 下载与安装

请使用仓库 `release-packages` 中的 `吃点啥-安卓离线版-v1.0.0.apk`，或下载 `吃点啥-安卓端本地版.zip`。详见 [安装说明](INSTALL.md)。

应用最低支持 Android 7.0，使用系统 WebView 显示内置界面。未声明联网、定位、存储等权限。APK 通过本机私有发布密钥签名，后续版本应继续使用同一密钥覆盖更新。

## 构建

- JDK 17
- Android SDK Platform 36 / Build Tools 35.0.0
- Gradle 8.13（仓库包含 Wrapper）
- Android Gradle Plugin 8.13.2

在当前目录执行 `./gradlew assembleRelease lintRelease`。没有私有签名配置时，生成的是 **未签名 APK**，不能作为正式安装包分发。

Windows 维护者可在仓库根目录运行：

```powershell
./scripts/build-android.ps1 -JavaHome '你的 JDK 17 路径' -SdkRoot '你的 Android SDK 路径'
```

该脚本首次发布时会在根目录 `.android-signing` 生成私有签名材料，之后复用同一密钥，并输出签名 APK、安装压缩包和 SHA-256 校验文件。如果已经存在发布 APK 但私钥缺失，脚本会停止，避免误用新密钥。**请单独备份整个 `.android-signing` 目录；不要上传 GitHub、发给他人或删除。** 丢失密钥后，新版本不能直接覆盖旧版。

GitHub Actions 仅生成调试版与未签名测试产物，不读取或保存发布密钥。用户应下载 `release-packages` 内的已签名版本，不要用 CI 调试版覆盖正式版。

## 校验

在仓库根目录执行 `node scripts/check-android.mjs`，可检查 80 种食物、筛选、连续抽取、持久化和离线策略。`lintRelease` 检查 Android 源码；发布脚本还会验证 APK 签名。

本应用按 [Android 官方本地内容指南](https://developer.android.com/develop/ui/views/layout/webapps/load-local-content) 使用 WebViewAssetLoader 加载内置资源，并拒绝其他网络请求。
