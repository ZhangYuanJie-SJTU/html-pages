# html-pages · 静态 HTML 托管仓库

> **Static HTML Pages Hosted via GitHub Pages**
> *集中托管个人 HTML 文档、报告、榜单、可视化等静态页面，通过 GitHub Pages 对外提供永久分享链接。*

[![Pages](https://img.shields.io/badge/GitHub-Pages-blue)](https://zhangyuanjie-sjtu.github.io/html-pages/)
[![PagesCount](https://img.shields.io/badge/Pages-10-green)]()
[![Domain](https://img.shields.io/badge/Domain-zhangyuanjie--sjtu.github.io-blue)](https://zhangyuanjie-sjtu.github.io/html-pages/)
[![Affiliation](https://img.shields.io/badge/Affiliation-SJTU-blue)](https://www.sjtu.edu.cn)

---

## 项目概览

| 项目 | 内容 |
|------|------|
| **访问域名** | [`zhangyuanjie-sjtu.github.io/html-pages/`](https://zhangyuanjie-sjtu.github.io/html-pages/) |
| **访问规则** | 每个子目录对应一个独立页面，路径为 `域名/html-pages/<子目录>/` |
| **分支策略** | `main` 与 `gh-pages` 保持同步镜像；Pages 部署源为 `gh-pages` |
| **部署工具** | Claude Code `/LoadHTML` skill · Git Data API（`github.com` 直连受限时） |

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
| 9 | ZYJ 就业去向榜 · 2028 秋招 | `zyj-jiuye-quxiang-bang/` | ~1.2M | 张元杰 · 235 家雇主 · 16 赛道 · 模型 v15.0 · 七维技术栈 × 12 岗位族 · 十二维评分 + 梯队（**最新**） | [→](https://zhangyuanjie-sjtu.github.io/html-pages/zyj-jiuye-quxiang-bang/) |
| 10 | 微弱信号检测 · 教学站点 | `weak-signal-detection/` | ~1.4M | 三章教学站点 · 359 条 KaTeX 公式 · 17 张自绘 SVG · 噪声计算器 | [→](https://zhangyuanjie-sjtu.github.io/html-pages/weak-signal-detection/) |

---

## 最新部署

### ZYJ 就业去向榜（2026-11-05 · 模型 v15.0 · 235 家）

> 它不是「哪家公司最好」，而是「以你的技术栈，哪条线最值得投」。

2028 秋招定制化去向榜（2029 届上海交大仪器科学与技术硕士 · 王侃课题组）。单文件自包含、零外部依赖、断网可开。

**这一版解决的三个问题**

- **岗位判断换入口**：不问「你研究什么」，问「你的技术栈能换到哪类活」。七维技术栈（固件 9.4 / 端侧 AI 9.2 / 信号 8.8 / 模拟前端 8.6 / 系统 7.8 / 传感器 7.6 / 数据 6.8）× 12 个岗位族的需求向量做双向匹配（覆盖度 × 利用率）——单向匹配会让「能力全面超额的人对所有岗位都满分」，所以大材小用同样扣分。
- **岗位分类带赛道语境**：「AI 推理工程师」在乐鑫是端侧部署、在商汤是服务器侧推理；「音频算法 / 通信算法」在恒玄是信号处理链，不是训模型。这是本版最大的修正——不带语境判断时，乐鑫被判成「只有 1/4 岗位对口」，恒玄被判成「只招 AI 算法岗」，两家都被压掉 20 名以上。
- **名次改成梯队**：相邻两名的分差小于评分误差（前 10 名平均 0.06 分 vs 单维误差 ±0.3），精确名次在数学上不成立。改为 13 个梯队，同梯队内名次不代表任何东西。

**评分体系（十二维）**

`技术栈 .23 · 2 年潜力 .12 · 薪资 .13 · 入场速度 .10 · 抗替代 .09 · 可达性 .08 · 平台 .06 · WLB .05 · 稳定 .05 · 通勤 .03 · 行业成长 .03 · 福利 .03`

- 方差贡献：**技术栈 36.2% / 薪资 26.6% / 可达性 14.4%**——技术栈是第一解释力，薪资第二，符合「硕士主要看技术栈」的判断
- 薪资用「风险调整后的实得」：超出 12 薪的浮动部分按 65 折计入；人才补贴不进实得包（多为三年分期，不能当年花）
- 「入场速度」按他自己的经历足迹打分：微创 9.8（实习过）· 乐鑫 9.4（ESP-IDF 就在用）· 阶梯 8.9（脑机 = 微针换场景）· 比特大陆 6.0（矿机固件没碰过）
- 「2 年潜力」问的不是方向好不好，而是「这个方向 × 他现在的底子，投两年能站到哪」

**校验方法**

- 62 家盲评池，**只给客观事实、不给任何模型分数**，四个角色独立排 Top 12：招聘猎头 / 公司 HR / 薪酬分析师 / 本人
- 结果 **Spearman ρ = +0.63**（方向一致）；前四名高度吻合（乐鑫、中微、联影、恒玄），最大分歧是华为车（三人排 #4–11，模型 #61），已在「能信到哪」页披露理由
- 公开稳健性：扰动区间、相邻名次可分概率、留一维检验、清单抽样框、剩余局限

**页面结构（8 个视图）**

入门必读（9 章 · 默认首页）· 排行榜 · 技术栈画像 · 岗位适配 · 赛道 · 行业抉择 · 能信到哪 · 方法与数据

**结论**

- 第一梯队：**乐鑫**（端侧 AI 与固件双对口、线宽 75%，唯一一家）· 中微 · 联影 · 恒玄 · 中科蓝讯 · 爱芯元智
- 可及性分布：直接对口 121 / 擦边可转 32 / 要跨一步 23 / 岗位未公开 59
- 榜里没有 ≠ 不该投——「能信到哪」页给了抽样框与自检方法

📎 **[立即查看 →](https://zhangyuanjie-sjtu.github.io/html-pages/zyj-jiuye-quxiang-bang/)**

---

### 微弱信号检测 · 教学站点（2026-10-26）

《微弱信号检测》（上海交大 2026 秋 · 杨明 / 雷华明）三章教学站点，逐节对照课件原文整理，公式与结论均回原文核过。

- **结构**：`index.html`（课程定位与四板块地图）+ `ch1` 综述 / `ch2` 噪声的基本概念 / `ch3` 物理噪声源
- **技术**：本地 KaTeX 渲染 359 条公式（断网可用）· 17 张自绘 SVG 图 · 侧栏随滚动定位 · 章末自测 + 噪声计算器
- **规模**：46 文件 · 1.4 MB
- **入口**：[https://zhangyuanjie-sjtu.github.io/html-pages/weak-signal-detection/](https://zhangyuanjie-sjtu.github.io/html-pages/weak-signal-detection/)

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
├── weak-signal-detection/  # 微弱信号检测教学站点（三章 · KaTeX 本地化）
├── zyj-jiuye-quxiang-bang/  # ZYJ 就业去向榜（模型 v15.0 · 235 家）
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

*Last updated: 2026-11-05*
