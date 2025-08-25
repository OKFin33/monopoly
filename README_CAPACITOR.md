# 垄断游戏 - Capacitor Android 构建指南

这是一个基于Web技术的垄断游戏，使用Capacitor框架可以打包成Android应用。

## 项目结构

```
monopoly/
├── www/                    # Web应用文件
│   ├── index.html         # 主页面
│   ├── styles.css         # 样式文件
│   └── game.js           # 游戏逻辑
├── package.json           # Node.js依赖配置
├── capacitor.config.ts    # Capacitor配置
└── README_CAPACITOR.md   # 本文件
```

## 环境要求

1. **Node.js** (版本 14 或更高)
2. **Android Studio** (用于Android开发)
3. **Android SDK** (API级别 21 或更高)
4. **Java Development Kit (JDK)** (版本 8 或更高)

## 安装步骤

### 1. 安装依赖

```bash
npm install
```

### 2. 添加Android平台

```bash
npm run cap:add
```

### 3. 同步项目文件

```bash
npm run cap:sync
```

## 构建和运行

### 开发模式

1. **启动开发服务器**:
   ```bash
   npm start
   ```

2. **在Android Studio中打开项目**:
   ```bash
   npm run cap:open
   ```

3. **构建并运行**:
   ```bash
   npm run cap:run
   ```

### 生产构建

1. **构建Android APK**:
   ```bash
   npm run cap:build
   ```

2. **生成的APK文件位置**:
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```

## 配置说明

### Capacitor配置 (capacitor.config.ts)

```typescript
{
  appId: 'com.monopoly.game',        // 应用包名
  appName: 'Monopoly Game',          // 应用名称
  webDir: 'www',                     // Web文件目录
  server: {
    androidScheme: 'https'           // Android URL方案
  }
}
```

### 自定义配置

1. **修改应用图标**:
   - 替换 `android/app/src/main/res/` 下的图标文件

2. **修改应用名称**:
   - 编辑 `android/app/src/main/res/values/strings.xml`

3. **修改包名**:
   - 更新 `capacitor.config.ts` 中的 `appId`
   - 重新运行 `npm run cap:add`

## 游戏功能

### 单人模式
- 两名玩家在同一设备上轮流游戏
- 掷骰子移动棋子
- 先到达终点的玩家获胜

### 多人模式
- 通过网络连接进行多人游戏
- 需要运行服务器端程序

### 游戏特色
- 完整的垄断游戏棋盘
- 40个不同的方块位置
- 支持红色和蓝色棋子
- 响应式设计，适配移动设备

## 故障排除

### 常见问题

1. **Android Studio无法打开项目**:
   ```bash
   npm run cap:sync
   npm run cap:open
   ```

2. **构建失败**:
   - 检查Android SDK是否正确安装
   - 确保JDK版本兼容
   - 清理项目: `cd android && ./gradlew clean`

3. **应用崩溃**:
   - 检查控制台日志
   - 确保所有Web文件正确同步

### 调试技巧

1. **启用开发者工具**:
   - 在Android设备上启用USB调试
   - 使用Chrome DevTools远程调试

2. **查看日志**:
   ```bash
   adb logcat | grep "Capacitor"
   ```

## 发布到Google Play

1. **生成签名APK**:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

2. **配置签名密钥**:
   - 在 `android/app/build.gradle` 中配置签名信息

3. **上传到Google Play Console**:
   - 使用生成的 `app-release.apk`

## 技术栈

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **框架**: Capacitor 5.x
- **平台**: Android (API 21+)
- **构建工具**: Gradle

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request来改进这个项目。 