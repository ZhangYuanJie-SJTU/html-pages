# html-pages · 静态 HTML 托管仓库

集中托管个人 HTML 文档、报告、榜单、可视化等静态页面，通过 GitHub Pages 对外提供永久分享链接。

**访问域名**：[`zhangyuanjie-sjtu.github.io/html-pages/`](https://zhangyuanjie-sjtu.github.io/html-pages/)
**访问规则**：每个子目录对应一个独立页面，访问路径为 `域名/html-pages/<子目录>/`

---

## 📚 页面索引

| # | 页面 | 路径 | 访问链接 |
|---|---|---|---|
| 1 | **985 工科学院就业榜 · 2026-2030** | `985-gongke-jiuye-bang/` | [查看](https://zhangyuanjie-sjtu.github.io/html-pages/985-gongke-jiuye-bang/) |
| 2 | 2028 届就业终极总榜 | `2028届就业终极总榜/` | [查看](https://zhangyuanjie-sjtu.github.io/html-pages/2028届就业终极总榜/) |
| 3 | CAN_Com AI 复核展示 | `cancom-ai-showcase/` | [查看](https://zhangyuanjie-sjtu.github.io/html-pages/cancom-ai-showcase/) |
| 4 | 上海嵌入式方向院校榜 | `shanghai-embedded-rankings/` | [查看](https://zhangyuanjie-sjtu.github.io/html-pages/shanghai-embedded-rankings/) |
| 5 | 输入误录榜 · 现象分析报告 | `shu-ru-wu-lu-bang-xing-fen-xi-bao-gao/` | [查看](https://zhangyuanjie-sjtu.github.io/html-pages/shu-ru-wu-lu-bang-xing-fen-xi-bao-gao/) |
| 6 | 输入误录榜 · 现象修复报告 | `shu-ru-wu-lu-bang-xing-xiu-fu-bao-gao/` | [查看](https://zhangyuanjie-sjtu.github.io/html-pages/shu-ru-wu-lu-bang-xing-xiu-fu-bao-gao/) |
| 7 | 夏令营学校详情 | `summer-camp-school-details/` | [查看](https://zhangyuanjie-sjtu.github.io/html-pages/summer-camp-school-details/) |
| 8 | 张雪峰智能志愿百科 | `zhangxuefeng-quiz/` | [查看](https://zhangyuanjie-sjtu.github.io/html-pages/zhangxuefeng-quiz/) |

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
- HTML 本地资源自包含化
- 推送到 `html-pages/<slug>/index.html`
- GitHub Pages 托管
- 可访问链接验证

## 📋 命名规则

- slug 从文件名生成：去扩展名 + 空格/特殊字符替换为 `-` + 转小写 + 截断 40 字符
- 同名重复部署 = 新版本覆盖

---

*Last updated: 2026-05*
