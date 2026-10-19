# html-pages · 静态 HTML 托管仓库

> **Static HTML Pages Hosted via GitHub Pages**
> *集中托管个人 HTML 文档、报告、榜单、可视化等静态页面，通过 GitHub Pages 对外提供永久分享链接。*

[![Pages](https://img.shields.io/badge/GitHub-Pages-blue)](https://zhangyuanjie-sjtu.github.io/html-pages/)
[![PagesCount](https://img.shields.io/badge/Pages-9-green)]()
[![Domain](https://img.shields.io/badge/Domain-zhangyuanjie--sjtu.github.io-blue)](https://zhangyuanjie-sjtu.github.io/html-pages/)
[![Affiliation](https://img.shields.io/badge/Affiliation-SJTU-blue)](https://www.sjtu.edu.cn)

---

## 项目概览

| 项目 | 内容 |
|------|------|
| **访问域名** | [`zhangyuanjie-sjtu.github.io/html-pages/`](https://zhangyuanjie-sjtu.github.io/html-pages/) |
| **访问规则** | 每个子目录对应一个独立页面，路径为 `域名/html-pages/<子目录>/` |
| **分支策略** | `main` 与 `gh-pages` 保持同步镜像；Pages 部署源为 `gh-pages` |
| **部署工具** | Claude Code `/LoadHTML` skill |

---

## 页面索引

| # | 页面标题 | 子目录 | 大小 | 定位 | 访问 |
|---|---|---|---|---|---|
| 1 | About Me \| 张元杰 | `about-me/` | ~600K | 小米实习生自我介绍页 · 嵌入式工程师 · 武汉理工→上交大 | [→](https://zhangyuanjie-sjtu.github.io/html-pages/about-me/) |
| 2 | 2029 届 交大仪科硕 就业决策台 | `career-console-2029/` | ~3.9M | 张元杰 · 微针阵列方向 · 9维定制评分 · 60家目标雇主 · 自包含头像 | [→](https://zhangyuanjie-sjtu.github.io/html-pages/career-console-2029/) |
| 3 | 985 工科学院就业榜 · 2026-2030 | `985-gongke-jiuye-bang/` | 248K | 公众视角 · 学院榜 | [→](https://zhangyuanjie-sjtu.github.io/html-pages/985-gongke-jiuye-bang/) |
| 4 | AI 驱动的 CAN_Com 测试报告智能复核 | `cancom-ai-showcase/` | 1.9M | 工作成果展示 | [→](https://zhangyuanjie-sjtu.github.io/html-pages/cancom-ai-showcase/) |
| 5 | 夏令营报名学校详情 | `summer-camp-school-details/` | 44K | 升学参考 | [→](https://zhangyuanjie-sjtu.github.io/html-pages/summer-camp-school-details/) |
| 6 | 张雪峰 · 智能志愿百科 | `zhangxuefeng-quiz/` | 68K | 交互测评 | [→](https://zhangyuanjie-sjtu.github.io/html-pages/zhangxuefeng-quiz/) |
| 7 | 胡程玮 · 2028届就业决策控制台 | `career-console-hcw/` | 128K | 清华材料与化工专硕 · 10维定制评分 · 61家目标雇主 | [→](https://zhangyuanjie-sjtu.github.io/html-pages/career-console-hcw/) |
| 8 | ZYJ 定制版 · 就业规划 | `career-plan-2029/` | ~474K | 张元杰 · 水凝胶微针阵列方向 · 端侧 AI 嵌入式 · 224 家雇主 · 10 维 + S/A/B/C 档 | [→](https://zhangyuanjie-sjtu.github.io/html-pages/career-plan-2029/) |
| 9 | ZYJ 就业去向榜 · 2028 秋招 | `zyj-jiuye-quxiang-bang/` | ~1.0M | 张元杰 · 224 家雇主 · 15 赛道 · 13 类岗位 · 模型 v10.0 · 十维评分 + 可支配包 + 抗替代双轨（**最新**） | [→](https://zhangyuanjie-sjtu.github.io/html-pages/zyj-jiuye-quxiang-bang/) |

---

## 最新部署

### ZYJ 就业去向榜（2026-10-19 · 模型 v10.0 · 224 家）

2028 秋招去向榜（模型 v10.0）：2029 届上海交大仪器科学与技术硕士（王侃课题组）的**就业去向排行榜**。单文件自包含、无外部依赖，页面分四栏：**排行榜 / 岗位适配 / 赛道 / 方法与数据**。

**核心内容**
- **224 家雇主 · 15 赛道 · 13 类岗位**：先定岗位、再定公司——每行写清楚"哪家公司、什么行业、最推荐你投哪个岗、上海口径下你大概能拿多少"
- **十维评分 + 可达性门槛修正**：`可达12 · 匹配15 · 薪资17 · 福利6 · WLB10 · 稳定7 · 成长11 · 平台8 · 抗替代6 · 通勤8`
- **抗替代双层**：企业层（这家公司的生意被 AI 抬高还是被重构，0.45）＋ 岗位层（你这个岗多少活儿会被模型吃掉，0.55）
- **薪资改「可支配包」**：公积金、福利、个税按上海 2026 口径归一化后折算——"25 万的院所和 30 万的民企，到手可能只差 1 万"
- **档位 S 6 / A 29 / B 68 / C 121**；**扰动后第 1 名 300/300 次未变**（档位比名次可信）
- **首选＝中微公司（#1，7.741）**；三三制投递（主力 6 · 冲刺 3 · 兜底 3）

📎 **[立即查看 →](https://zhangyuanjie-sjtu.github.io/html-pages/zyj-jiuye-quxiang-bang/)**

---

### ZYJ 定制版 · 就业规划（2026-10-18 · 源版 v5.0 · 224 家）

2029 届上海交大仪器科学与技术硕士（王侃课题组）的定制版就业规划，研究方向已更新为 **水凝胶微针阵列电化学传感系统**。单文件自包含，无外部依赖。

**核心内容**
- **第一身份岗**：端侧 AI 嵌入式工程师（第二＝生理/生化信号感知算法）
- **8 行业 β + 风口×壁垒四象限 + 十年天花板合成**（半导体/AIoT 领跑 · 医疗＝高壁垒主攻仓）
- **10 维评分 + F1–F8 硬过滤**：S 档 7 家 / A 档 32 家（全样本 224 家）
- **薪资**：全样本中位 25.3 万 · S+A 重点池 30.0 万；**三三制投递**（冲刺 30% / 主力 50% / 兜底 20%）
- **决策**：乐鑫首选；含家庭财务三档、两年路线图与投递作战包

📎 **[立即查看 →](https://zhangyuanjie-sjtu.github.io/html-pages/career-plan-2029/)**

---

### About Me | 张元杰（2026-05-09）

小米汽车OS实习生 · 嵌入式工程师 · 武汉理工大学 → 上海交通大学（保研推免）

单页 HTML 自我介绍，包含故事叙述、照片墙、教育/实习/项目/荣誉等模块，专为小米实习生社区交友分享设计。

📎 **[立即查看 →](https://zhangyuanjie-sjtu.github.io/html-pages/about-me/)**

---

### 2029 届 交大仪科硕 就业决策台（2026-05-11 · v7.2 · 自包含头像）

面向 2029 届上海交大仪器科学与技术硕士（王侃课题组）的个人就业决策工具。研究方向：**基于微针阵列的可穿戴电化学传感系统**。头像已内嵌为 data URI，单文件自包含。

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

## 部署方式

使用 Claude Code 的 `/LoadHTML` skill 一键部署，自动完成：
- HTML 本地资源自包含化（图片/CSS/JS 转 data URI）
- 推送到 `html-pages/<slug>/index.html`
- GitHub Pages 托管
- 可访问链接验证

### 命名规则

- `slug` 从文件名生成：去扩展名 → 空格/特殊字符替换为 `-` → 转小写 → 截断 40 字符
- 同名重复部署 = 新版本覆盖，不会产生碎片目录

---

## 仓库结构

```
html-pages/
├── README.md
├── zyj-jiuye-quxiang-bang/  # ZYJ 就业去向榜（模型 v10.0 · 最新）
├── about-me/               # About Me 自我介绍页
├── career-plan-2029/       # ZYJ 定制版就业规划（v9.0 口径）
├── career-console-2029/    # 就业决策台（历史）
├── 985-gongke-jiuye-bang/  # 985 工科就业榜
├── cancom-ai-showcase/     # CAN_Com 测试报告复核展示
├── summer-camp-school-details/  # 夏令营学校详情
├── zhangxuefeng-quiz/      # 张雪峰智能志愿百科
└── career-console-hcw/     # 胡程玮·2028届就业决策控制台
```

---

## 仓库维护

- **所有页面都在子目录中**，仓库根目录只放 `README.md`
- 如果出现陌生目录，大概率是历史测试残留，可安全删除
- `main` 与 `gh-pages` 始终保持一致；任何一侧更新后应同步推另一侧

---

## 作者

| | 姓名 | 单位 | 联系方式 |
|---|---|---|---|
| **维护者** | 张元杰 | 上海交通大学 自动化与传感科学与工程学院 硕士生 | [GitHub](https://github.com/ZhangYuanJie-SJTU) |

---

*Last updated: 2026-10-19*
