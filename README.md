# html-pages · 静态 HTML 托管仓库

集中托管个人 HTML 文档、报告、榜单、可视化等静态页面，通过 GitHub Pages 对外提供永久分享链接。

- **访问域名**：[`zhangyuanjie-sjtu.github.io/html-pages/`](https://zhangyuanjie-sjtu.github.io/html-pages/)
- **访问规则**：每个子目录对应一个独立页面，路径为 `域名/html-pages/<子目录>/`
- **分支策略**：`main` 与 `gh-pages` 保持同步镜像；Pages 部署源为 `gh-pages`

---

## 📚 页面索引

| # | 页面标题 | 子目录 | 大小 | 定位 | 访问 |
|---|---|---|---|---|---|
| 1 | **🎯 2029届·张元杰·就业决策驾驶舱 v3.0** | `career-console-2029/` | 150K | 个人决策工具 · 7维评分 · 60家公司 | [→](https://zhangyuanjie-sjtu.github.io/html-pages/career-console-2029/) |
| 2 | 985 工科学院就业榜 · 2026-2030 | `985-gongke-jiuye-bang/` | 248K | 公众视角 · 学院榜 | [→](https://zhangyuanjie-sjtu.github.io/html-pages/985-gongke-jiuye-bang/) |
| 3 | AI 驱动的 CAN_Com 测试报告智能复核 | `cancom-ai-showcase/` | 1.9M | 工作成果展示 | [→](https://zhangyuanjie-sjtu.github.io/html-pages/cancom-ai-showcase/) |
| 4 | 夏令营报名学校详情 | `summer-camp-school-details/` | 44K | 升学参考 | [→](https://zhangyuanjie-sjtu.github.io/html-pages/summer-camp-school-details/) |
| 5 | 张雪峰 · 智能志愿百科 | `zhangxuefeng-quiz/` | 68K | 交互测评 | [→](https://zhangyuanjie-sjtu.github.io/html-pages/zhangxuefeng-quiz/) |

---

## 🚀 最新部署

### 2029届·张元杰·就业决策驾驶舱 v3.0（2026-05-07 全面重构）

原《2028届就业终极总榜》完全推翻重构为**个人就业决策驾驶舱**，从静态排行榜升级为交互式决策工具。

**核心改进**
- **7 维评分体系 V3.2**（薪酬22% + 技术契合20% + 定居14% + 长期职业13% + WLB12% + 禀赋杠杆10% + 行业前景9%）
- **60 家候选公司**，覆盖 6 大类雇主（医疗电子 / 汽车电子 / AIoT / 央国企 / 医院工程科 / 独角兽）
- **权重可调 + Slider 实时重算排名**（4 个预设：默认 / 薪资优先 / 定居优先 / 技术契合优先 / WLB优先）
- **Tier 分位数动态分档**（SSS 必投 / SS 强推 / S 推荐 / A 可投 / B 保底 + ⭐ 隐藏福地独立轨道）

**12 个功能模块**
1. 个人画像（技能栈 + 硬通货 + 市场定位）
2. 七维评价体系（含权重可调控制台）
3. 梯度标准（按分位数动态划分）
4. 公司总榜（6 类 × 4 区位 × 7 维排序 × 搜索筛选）
5. 对比矩阵热力图（Top 20/30/60 切换）
6. 薪资×WLB 散点图（四象限定位 · 悬停显示公司详情）
7. 5 年预期收入曲线（含涨薪 + 股票兑现 + 公积金累计）
8. 单位类型百科（六类目标雇主全面解读）
9. 求职作战时间线（28 节点 · 2026.05 → 2029.04）
10. 上海定居计算器（房价 × 通勤 × 宝山置换 × 父母支持 × 月供可负担度）
11. 行业前瞻专刊（医疗电子 / 汽车电子 / AIoT · 2029-2032 趋势）
12. 数据来源与置信度（🟢高 / 🟡中 / 🟠市场估算 标签透明化）

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

*Last updated: 2026-05-07*
