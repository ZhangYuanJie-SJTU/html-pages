# html-pages · 静态 HTML 托管仓库

集中托管个人 HTML 文档、报告、榜单、可视化等静态页面，通过 GitHub Pages 对外提供永久分享链接。

- **访问域名**：[`zhangyuanjie-sjtu.github.io/html-pages/`](https://zhangyuanjie-sjtu.github.io/html-pages/)
- **访问规则**：每个子目录对应一个独立页面，路径为 `域名/html-pages/<子目录>/`
- **分支策略**：`main` 与 `gh-pages` 保持同步镜像；Pages 部署源为 `gh-pages`

---

## 📚 页面索引

| # | 页面标题 | 子目录 | 大小 | 定位 | 访问 |
|---|---|---|---|---|---|
| 1 | **张元杰就业决策榜单** | `career-console-2029/` | ~350K | 2029届交大仪科硕 · 微针阵列方向 · 9维评分 · 60家公司 | [→](https://zhangyuanjie-sjtu.github.io/html-pages/career-console-2029/) |
| 2 | 985 工科学院就业榜 · 2026-2030 | `985-gongke-jiuye-bang/` | 248K | 公众视角 · 学院榜 | [→](https://zhangyuanjie-sjtu.github.io/html-pages/985-gongke-jiuye-bang/) |
| 3 | AI 驱动的 CAN_Com 测试报告智能复核 | `cancom-ai-showcase/` | 1.9M | 工作成果展示 | [→](https://zhangyuanjie-sjtu.github.io/html-pages/cancom-ai-showcase/) |
| 4 | 夏令营报名学校详情 | `summer-camp-school-details/` | 44K | 升学参考 | [→](https://zhangyuanjie-sjtu.github.io/html-pages/summer-camp-school-details/) |
| 5 | 张雪峰 · 智能志愿百科 | `zhangxuefeng-quiz/` | 68K | 交互测评 | [→](https://zhangyuanjie-sjtu.github.io/html-pages/zhangxuefeng-quiz/) |

---

## 🚀 最新部署

### 张元杰就业决策榜单（2026-05-08 最终版）

面向 2029 届上海交大仪器科学与技术硕士（王侃课题组）的个人就业决策工具。研究方向：**基于微针阵列的可穿戴电化学传感系统**。

**评分体系**
- **9 维评分**：薪酬 · 现栈契合 · 未来栈契合 · 上海地缘 · 职业价值 · WLB · 禀赋变现 · 行业前景 · 课题组契合
- **课题组 4 轴**：微针阵列传感器制备 · 信号读出电路与嵌入式系统 · 边缘AI信号处理 · 可穿戴系统集成
- **60 家候选公司**，覆盖 6 大类雇主（医疗电子 / 汽车电子 / AIoT / 央国企 / 医院工程科 / 独角兽）
- **权重可调 + 5 种预设**（默认 / 薪资优先 / 技术契合优先 / 定居优先 / 课题组契合优先）
- **Tier 分位数动态分档**（SSS 必投 / SS 强推 / S 推荐 / A 可投 / B 保底）

**12 个功能模块**
1. 个人画像（技能栈 + 硬通货 + 研究方向）
2. 9 维权重控制台（含 Slider 实时重算）
3. 梯度标准（按分位数动态划分）
4. 公司总榜（6 类 × 搜索筛选 × 排序）
5. 对比矩阵热力图（Top 20/30/60 切换）
6. 薪资×WLB 散点图（四象限定位）
7. 5 年预期收入曲线（含涨薪 + 股票兑现 + 公积金）
8. 单位类型百科（六类目标雇主解读）
9. 求职作战时间线（2026.05 → 2029.04）
10. 上海定居计算器（房价 × 通勤 × 置换 × 月供）
11. 行业前瞻专刊（医疗电子 / 汽车电子 / AIoT）
12. 数据来源与置信度标签

📎 **[立即查看 →](https://zhangyuanjie-sjtu.github.io/html-pages/career-console-2029/)**

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

*Last updated: 2026-05-08*
