# 隐私说明

BiliDJ 只在 `https://www.bilibili.com/video/*` 视频页运行内容脚本。

## 本地保存的数据

插件使用 `chrome.storage.local` 保存：

- 用户创建的一键跳转快捷键。
- 用户最近加载的伴奏链接或 BV 号。
- 伴奏标题等界面设置。

这些数据保存在用户本机浏览器扩展存储中，不会上传到服务器。

## 网络访问

插件不会自建后端，也不会向第三方服务器上传用户数据。用户点击搜索时，会打开 Bilibili 搜索结果页面；用户粘贴 BV 或链接后，右轨使用 Bilibili 官方播放器嵌入页面展示视频。

## 权限用途

- `storage`：保存一键跳转快捷键和伴奏设置。
- `https://www.bilibili.com/*`：在 B站视频页注入简单混音助手。
- `https://search.bilibili.com/*`：打开 B站搜索入口。
- `https://player.bilibili.com/*`：显示右边 B站嵌入播放器。
