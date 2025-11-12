---
title: Obsidian + Gemini CLI：一次配置，永久丝滑的本地 AI 共创知识库搭建指南
permalink: obsidian-gemini-cli-guide
tags: [Obsidian, Gemini, CLI, 教程]
---

我一直想找一个轻量、灵活、能本地电脑+手机使用又能轻松发布成线上网站的开源笔记工具，Obsidian完美符合我的需求。

最近，又刚好看到了苍河老师写了一篇知识整合的文章：[Gemini Cli + Obsidian 才是知识管理的神！！](https://mp.weixin.qq.com/s/f5HWooI1a8pnSObJ9rSqMw)他尝试将 Google 的 Gemini CLI 集成到 Obsidian 中，打造了一个**免费且轻量**的本地 AI 笔记助手”。

我按照他的指南实践了整个过程，非常有成就感，但也踩了不少坑。先来看下安装好后，我在obsidian 里是如何和gemini 共创，为知识类文章添加细节的。
![[obsidian-gemini-cli-guide/ScreenFlow.mp4]]

现在我将我的实践经验、特别是关于**国内网络环境下的代理设置**和**终端环境配置**的细节，整理成这篇完整的指南，如果你也遇到了类似的问题，希望这篇文章可以启发到你。

---

## 核心流程概览

我们的目标是：在 Obsidian 的终端插件里，能像在系统终端一样，随时通过 `gemini` 命令调用 AI。

要实现这个目标，需要解决三个核心问题：
1.  **网络问题**：让终端能访问到 Gemini API。
2.  **命令问题**：简化 `gemini` 命令，使其可以全局调用。
3.  **环境问题**：让 Obsidian 内置终端与系统终端环境保持一致。

---

## 步骤一：配置网络代理 (国内环境关键)

直接访问 Gemini API 会失败，因此必须配置代理。这里提供两种主流方案。

### 方案 A：使用 Clash Verge 的 TUN 模式 (一劳永逸)

如果你使用 Clash Verge 或其他支持 TUN 模式的代理工具，这是最推荐的方案。TUN 模式会创建一个虚拟网卡，接管系统所有应用的流量（包括命令行），实现真正的“全局代理”。

**1. 开启 TUN 模式**
在 Clash Verge 的“系统设置”中，开启“虚拟网卡模式 (TUN)”。建议使用 `GVisor` 作为堆栈，并开启“自动设置全局路由”。
![[obsidian-gemini-cli-guide/Pasted image 20251112034649.png]]
![[obsidian-gemini-cli-guide/Pasted image 20251112034404.png]]
![[obsidian-gemini-cli-guide/Pasted image 20251112025751.png]]
**2. 验证代理是否生效**
开启后，在系统终端输入 `curl -I https://ipinfo.io`。如果返回的 `country` 是你代理节点的国家（如 `SG`、`US`），则证明终端流量已成功被代理。
> **注意**：有时开启后 IP 不会立即改变，可以尝试重启几次代理工具。

**3. 配置 API Key**
在 TUN 模式下，你唯一要做的就是在 `.zshrc` 文件中写入你的 API Key。

### 附：如何编辑 `.zshrc` 文件？(新手必看)

`.zshrc` 是 Zsh 的核心配置文件，我们所有的环境变量和代理设置都需要写入这里。编辑它主要有两种方式：图形界面和命令行。

#### 方式一：使用文本编辑器 (最简单)
这是最推荐新手使用的方法。在终端输入：
```bash
open -e ~/.zshrc
```
- **工作原理**：这个命令会使用 macOS 自带的 **TextEdit (文本编辑)** 应用打开 `.zshrc` 文件，就像打开一个普通的 `.txt` 文档一样。
- **如何保存**：修改完成后，直接按键盘上的 `Command + S` 快捷键保存，然后关闭窗口即可。

> **⚠️ 常见问题：** 如果你用 `open -e` 命令后，看到一个弹窗提示“**你可以复制此文稿并编辑副本**”，**请不要点击“复制”**！
> - **原因**：这是 macOS 的安全机制，防止你意外修改重要的配置文件。
> - **后果**：如果你编辑了副本，所有修改都将**无效**，因为终端只认原始的 `.zshrc` 文件。
> - **正确做法**：关闭弹窗，回到终端，使用 `sudo` 命令以管理员权限重新打开文件：
>   ```
>   sudo open -e ~/.zshrc
>   ```
>   输入密码后，你就可以正常编辑和保存了。

#### 方式二：使用命令行编辑器 Nano (更通用)
`nano` 是一个内置在终端里的编辑器，无需打开新的窗口。
```bash
nano ~/.zshrc
```
- **工作原理**：它会直接在当前的终端窗口里打开文件进行编辑。这种方式在所有终端环境（包括远程服务器）下都适用。
- **如何保存**：
    1.  按 `Control + O` (字母O) 来写入/保存。
    2.  按 `回车` 确认文件名。
    3.  按 `Control + X` (字母X) 退出编辑器。

---

#### 特殊情况：什么时候需要 `sudo`？

`sudo` 是一个提权命令，相当于“以管理员身份运行”。

正常情况下，`.zshrc` 文件位于你的用户主目录下，**你拥有完全的读写权限，因此不需要 `sudo`**。

但如果你在编辑保存时遇到 `Permission denied` (权限被拒绝) 的错误，说明文件权限可能被意外修改了。这时，你才需要在命令前加上 `sudo` 来强制保存。

- **使用 `sudo` 的命令**：
  ```bash
  # 使用 nano 以管理员身份编辑
  sudo nano ~/.zshrc

  # 使用文本编辑器以管理员身份编辑
  sudo open -e ~/.zshrc
  ```
- **操作流程**：输入命令后，系统会提示你输入电脑的开机密码（输入时密码不可见），验证通过后即可编辑和保存。

**总结：** 优先使用 `open -e` 或 `nano`。只有在遇到“Permission denied”时，才尝试在命令前加上 `sudo`。

---

现在，将你的 API Key 添加到 `.zshrc` 文件中：
```bash
# 在 ~/.zshrc 文件中添加
export GEMINI_API_KEY="替换成你的真实API Key"
```
添加完成后，记得保存文件，然后运行 `source ~/.zshrc` 使其生效。
![[obsidian-gemini-cli-guide/Pasted image 20251112040302.png]]

### 方案 B：在 `.zshrc` 中手动写入代理 (适用于 ClashX 等)

如果你的代理工具没有 TUN 模式（如旧版的 ClashX），可以通过在 `.zshrc` 中写入代理变量，让终端手动走代理。

**1. 编辑 `.zshrc` 文件**
将以下配置完整地添加到你的 `.zshrc` 文件中：
```bash
# === ~/.zshrc Gemini CLI 自动配置 ===

# 1. 你的 API Key
export GEMINI_API_KEY="替换成你的真实API Key"

# 2. 你的代理端口 (ClashX/Verge 默认为 7890)
export http_proxy="http://127.0.0.1:7890"
export https_proxy="http://127.0.0.1:7890"
export ALL_PROXY="socks5://127.0.0.1:7890"

# 3. 确保 Node 和 Gemini 能被找到
export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"
```

**2. 使配置生效**
保存文件后，在终端运行 `source ~/.zshrc`。

这样配置后，效果等同于 TUN 模式，所有终端会话都会自动使用代理。

---

## 步骤二：全局安装并简化 Gemini CLI

每次都输入 `npx https://github.com/google-gemini/gemini-cli` 过于繁琐。我们可以通过全局安装，让它成为一个永久可用的命令。

**1. 全局安装**
在你的系统终端（Terminal 或 iTerm2）中运行：
```bash
npm install -g @google/gemini-cli
```

**2. 验证安装**
安装成功后，运行 `which gemini`，如果看到类似 `/usr/local/bin/gemini` 或 `/opt/homebrew/bin/gemini` 的路径输出，就说明安装成功了。

**3. (可选) 设置别名**
为了输入更方便，可以在 `.zshrc` 配置文件中为它设置一个别名。
```bash
# 在 ~/.zshrc 文件中添加
alias gemini="/usr/local/bin/gemini"
```
*小提示：不知道如何编辑 `.zshrc`？在终端输入 `open -e ~/.zshrc` 即可用文本编辑器打开。*

---

## 步骤三：配置 Obsidian 终端插件

最后一步，是确保 Obsidian 内的终端能正确加载我们刚刚的所有配置。

1.  打开 Obsidian **设置 → 第三方插件 → 搜索并安装Terminal**。
2.  在配置选项中，进行如下设置：
    *   **Shell path**: `/bin/zsh`
    *   参数里前置添加: `-l` (注意是小写的 L，不是数字 1)
    *   **终端环境 (Profile)**: 选择 `darwinIntegratedDefault`
![[obsidian-gemini-cli-guide/Pasted image 20251112170256.png]]
![[obsidian-gemini-cli-guide/Pasted image 20251112170901.png]]
![[obsidian-gemini-cli-guide/Pasted image 20251112171914.png]]
**为什么要这样设置？**
- `darwinIntegratedDefault` 指的是使用系统默认的终端配置，它会自动加载 `.zshrc` 文件。
- `-l` 参数会以 login shell 的模式启动，确保所有环境变量（如 API Key、代理、PATH）都被正确载入。

完成这步后，你在 Obsidian 终端里输入 `gemini`，就和在系统终端里体验完全一致了！

---

## 总结与检查清单

| 目标 | 推荐设置 | 作用 |
| :--- | :--- | :--- |
| **网络代理** | **Clash Verge TUN 模式** (首选) | 一劳永逸，无需额外配置 |
| | 在 `.zshrc` 中写代理变量 (备选) | 适用于不支持 TUN 的工具 |
| **命令简化** | `npm install -g @google/gemini-cli` | 全局安装，随时调用 `gemini` |
| **快速调用** | 在 `.zshrc` 中写入 `alias gemini` | 输入 `gemini` 即可启动 |
| **API Key** | 在 `.zshrc` 中写入 `GEMINI_API_KEY` | 身份验证，必须配置 |
| **Obsidian 终端** | 环境选 `darwinIntegratedDefault`，参数加 `-l` | 确保加载系统配置，避免命令找不到 |

现在，你可以在 Obsidian 中选中任意一段文字，然后通过 `gemini` 命令让 AI 为你总结、翻译、解释代码或发散创意，真正实现了知识管理与 AI 助手的无缝集成。
