# html-pages · 静态 HTML 托管仓库

集中托管个人 HTML 文档、报告、榜单、可视化等静态页面，通过 GitHub Pages 对外提供永久分享链接。

- **访问域名**：[`zhangyuanjie-sjtu.github.io/html-pages/`](https://zhangyuanjie-sjtu.github.io/html-pages/)
- **访问规则**：每个子目录对应一个独立页面，路径为 `域名/html-pages/<子目录>/`
- **分支策略**：`main` 与 `gh-pages` 保持同步镜像；Pages 部署源为 `gh-pages`

---

## 📚 页面索引

| # | 页面标题 | 子目录 | 大小 | 访问 |
|---|---|---|---|---|
| 1 | **985 工科学院就业榜 · 2026-2030** | `985-gongke-jiuye-bang/` | 248K | [→](https://zhangyuanjie-sjtu.github.io/html-pages/985-gongke-jiuye-bang/) |
| 2 | 2029 届上海交大仪科硕士就业终极总榜 | `2028届就业终极总榜/` | 52K | [→](https://zhangyuanjie-sjtu.github.io/html-pages/2028届就业终极总榜/) |
| 3 | AI 驱动的 CAN_Com 测试报告智能复核 | `cancom-ai-showcase/` | 1.9M | [→](https://zhangyuanjie-sjtu.github.io/html-pages/cancom-ai-showcase/) |
| 4 | 上海嵌入式领域大厂推荐排行榜 | `shanghai-embedded-rankings/` | 92K | [→](https://zhangyuanjie-sjtu.github.io/html-pages/shanghai-embedded-rankings/) |
| 5 | 输入物鲁棒性专项分析报告 | `shu-ru-wu-lu-bang-xing-fen-xi-bao-gao/` | 84K | [→](https://zhangyuanjie-sjtu.github.io/html-pages/shu-ru-wu-lu-bang-xing-fen-xi-bao-gao/) |
| 6 | 输入物鲁棒性修复报告 | `shu-ru-wu-lu-bang-xing-xiu-fu-bao-gao/` | 24K | [→](https://zhangyuanjie-sjtu.github.io/html-pages/shu-ru-wu-lu-bang-xing-xiu-fu-bao-gao/) |
| 7 | 夏令营报名学校详情 | `summer-camp-school-details/` | 44K | [→](https://zhangyuanjie-sjtu.github.io/html-pages/summer-camp-school-details/) |
| 8 | 张雪峰 · 智能志愿百科 | `zhangxuefeng-quiz/` | 68K | [→](https://zhangyuanjie-sjtu.github.io/html-pages/zhangxuefeng-quiz/) |

---

## 🚀 最新部署

### 985 工科学院就业榜 · 2026-2030

以研究生就业薪资 · 就业质量为核心，按研究方向精细化分档。18 所 985 工科前列 × 170+ 工科学院 × 550+ 方向子档。

**核心章节**
- 前言与九维量化模型
- 2026-2030 赛道前瞻（5 梯度）
- 跨校分档榜（SSS+ → B 共 10 档，70+ 学院详情）
- 数据可视化（4 张 SVG 图表：薪资箱线 / 沪认可度 / 赛道区间 / 方向对比）
- 方向速查矩阵 / 分校索引 / 同校分化
- 沪 · 江浙沪认可度榜 Top 15
- 决策树（6 条职业路径）
- 前景专刊：仪器 · 生医工 · 医疗电子 交叉方向评估

📎 **[立即查看 →](https://zhangyuanjie-sjtu.github.io/html-pages/985-gongke-jiuye-bang/)**

---

## 🛠️ 部署方式

使用 Claude Code 的 `/LoadHTML` skill 一键部署，自动完成：
- HTML 本地资源自包含化（图片/CSS/JS 转 data URI）
- 推送到 `html-pages/<slug>/index.html`
- GitHub Pages 托管
- 可访问链接验证

### 命名规则

- `slug` 从文件名生成：去扩展名 → 空格/特殊字符替换为 `-` → 转小写 → 截断 40 字符
- 同名重复部署 = 新版本覆盖，不会产生碎片目录

---

## 🗂️ 仓库维护

- **所有页面都在子目录中**，仓库根目录只放 `README.md`
- 如果出现陌生目录，大概率是历史测试残留，可安全删除
- `main` 与 `gh-pages` 始终保持一致；任何一侧更新后应同步推另一侧

---

*Last updated: 2026-05-07*
