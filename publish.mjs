import fs from 'fs';
import path from 'path';

// Paragraph API 配置
const API_URL = 'https://public.api.paragraph.com/api/v1/posts';
const TOKEN = 'b22e877a-53e5-488c-9186-0e45fa442452'; // 您的专属 Token

async function publishArticle() {
    try {
        // 获取命令行参数中的文件名，如果没有则使用默认值
        const fileName = process.argv[2] || 'web3-wallet-comparison-review.md';
        const filePath = path.join(process.cwd(), 'content', fileName);

        if (!fs.existsSync(filePath)) {
            console.error(`❌ 找不到文件：${filePath}`);
            return;
        }

        // 读取本地 Markdown 文件内容
        let markdownContent = fs.readFileSync(filePath, 'utf-8');
        console.log('📝 正在读取文章内容，准备发布到 Paragraph...');

        // 🖼️ 核心修复：将 Obsidian 的本地双链图片转换成线上标准 Markdown 链接
        // 关键修复：前后加上换行符 `\n\n`，强制图片生成独立的 Block，防止连续多张图片拼在一起
        // 或者是紧贴在 Blockquote 下方从而被 Paragraph 解析器吃掉。
        markdownContent = markdownContent.replace(/!\[\[([^\]]+)\]\]/g, (match, p1) => {
            const filename = p1.split('|')[0].trim();
            const formattedFilename = filename.replace(/ /g, '-');
            const imageUrl = `https://blog.sparkvalues.com/${formattedFilename}`;
            return `\n\n![${filename}](${imageUrl})\n\n`;
        });

        // 📝 样式修复：将 Obsidian 的 Callouts (像 > [!info] 标题) 转换为标准的加粗文本引用
        markdownContent = markdownContent.replace(/^>\s*\[!([^\]]+)\]\s*(.*)$/gm, (match, type, title) => {
            const displayTitle = title.trim() || type.charAt(0).toUpperCase() + type.slice(1);
            return `> **${displayTitle}**`;
        });

        // 🧠 智能解析：提取 Markdown 的 YAML Frontmatter 元数据
        let title = "Web3 主流钱包深度测评：从 EOA 到 AA、MPC 的注册体验与思考";
        let tags = [];
        let slug = "";
        let preview = "";

        // 匹配头部 YAML 区域，兼容 Windows/Mac 换行符
        const frontmatterMatch = markdownContent.match(/^---\r?\n([\s\S]*?)\r?\n---/);
        if (frontmatterMatch) {
            const frontmatter = frontmatterMatch[1];

            // 提取标题
            const titleMatch = frontmatter.match(/title:\s*(.+)/);
            if (titleMatch) title = titleMatch[1].trim();

            // 提取路径作为 slug
            const permalinkMatch = frontmatter.match(/permalink:\s*\/?posts\/([^\/]+)/);
            if (permalinkMatch) slug = permalinkMatch[1].trim();

            // 提取 tags 作为 Paragraph 的 categories
            const tagsMatch = frontmatter.match(/tags:\r?\n((?:\s*-\s*.+\r?\n)+)/);
            if (tagsMatch) {
                tags = tagsMatch[1].split(/\r?\n/)
                    .map(t => t.replace('-', '').trim())
                    .filter(t => t);
            }

            // 【关键修复这里】移除非正文的 Frontmatter (标题/日期等属性)，确保不被渲染到正文部分
            markdownContent = markdownContent.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n*/, '');

            // 生成一段大约140字的摘要预览
            const pureText = markdownContent.replace(/!\[.*?\]\(.*?\)/g, '')
                .replace(/[#*>|-]/g, '')
                .replace(/\s+/g, ' ');
            preview = pureText.substring(0, 140) + '...';
        }

        // 发起 API 请求，推送文章
        const payload = {
            title: title,
            markdown: markdownContent,
            sendNewsletter: false, // 改为 true 会自动发送邮件给订阅者
            ...(slug && { slug: slug }),
            ...(tags.length > 0 && { categories: tags }),
            ...(preview && { postPreview: preview })
        };

        console.log(`📤 准备推送文章字段:
- 标题: ${title}
- 标签: ${tags.join(', ')}
- 自定义连接(Slug): ${slug}
- 预览字数: ${preview.length}`);

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
        }

        const result = await response.json();
        console.log('✅ 发布成功！文章已被推送到 Paragraph。');
        console.log('详情返回:', JSON.stringify(result, null, 2));

    } catch (error) {
        console.error('❌ 发布失败，请检查：');
        console.error(error.message || error);
    }
}

publishArticle();
