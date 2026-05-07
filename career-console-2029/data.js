/* ═══════════════════════════════════════════════════════════
   Elemental · V4.0 数据层
   ═══════════════════════════════════════════════════════════
   核心改动 vs V3.2：
   - 权重 9 维：pay20 / tech_now10 / tech_future8 / geo10 / career11
                / wlb10 / endow13 / industry8 / cohort6 / housing4
   - 删除 "落户" 维度（已沪籍）
   - 技术栈拆分 current_stack / future_stack（研究生3年成长）
   - 新增 王侃课题组4方向契合度：poct / sweat / ai_ivd / energy
   - 新增 宝山置换资金链打分
   - 新增 AFM 末位挂名加分（研究型岗位）
   - 新增 实习转正专属加分（小米/宇构智核）
   ═══════════════════════════════════════════════════════════ */

const WEIGHTS_V4 = {
  pay:          0.20,  // 综合薪酬·5年NPV
  tech_now:     0.10,  // 现栈契合(2026)
  tech_future:  0.08,  // 未来栈契合(2029)
  geo:          0.10,  // 上海地缘深度（不含落户）
  career:       0.11,  // 长期职业价值
  wlb:          0.10,  // WLB 可持续性
  endow:        0.13,  // 稀缺禀赋变现（AFM/专利/领导力）
  industry:     0.08,  // 行业前景 2029-2032
  cohort:       0.06,  // 王侃课题组 4 方向契合
  housing:      0.04   // 宝山置换资金链
};

/* 王侃课题组 4 大方向 */
const COHORT_AXES = {
  poct:   'POCT 即时诊断',
  sweat:  '汗液/柔性可穿戴',
  ai_ivd: 'AI 体外诊断算法',
  energy: '自供能/能量收集'
};

/* 目标区房价锚（2029预测，单位：万元/㎡）*/
const DISTRICT_PRICE = {
  '嘉定新城':    4.0,
  '嘉定安亭':    2.9,
  '闵行老闵行':  3.9,
  '闵行马桥':    5.5,
  '闵行莘庄':    5.9,
  '张江':        9.5,
  '临港':        4.2,
  '浦东新区':    6.2,
  '徐汇':        8.5,
  '长宁':        7.0,
  '黄浦':        9.0,
  '静安':        8.0,
  '虹口':        6.5,
  '宝山':        3.2,
  '浦东周浦':    4.8
};

/* 资金池常量 */
const CAPITAL = {
  baoshanNet: 200,      // 宝山净到手 200w（现实中枢）
  baoshanOpt: 220,      // 乐观 220w
  baoshanPes: 165,      // 悲观 165w
  parentSupport: 50,    // 父母支持
  fixedPool: 250        // baoshanNet + parentSupport
};

/* ═══ 60 家公司 V4 数据集 ═══ */
const COMPANIES_V4 = [
  // ═══ Tier S+ 候选 ═══
  {
    id: 1, name: '联影医疗', en: 'United Imaging Healthcare', ticker: '688271.SH',
    cat: 'medical', subcat: '医疗影像龙头',
    dist: '嘉定新城', commute_jd: 5, commute_mh: 3,
    cash_low: 35, cash_high: 48, cash_mid: 41.5,
    fund_pct: 8, fund_total: 8.8, stock: '股权激励·3年兑现',
    total5y: 245,
    wlb_hours: 44,
    // 9 维打分
    pay: 8.2, tech_now: 9.5, tech_future: 9.8, geo: 9.5, career: 9.2,
    wlb: 8.5, endow: 9.0, industry: 9.5, cohort: 9.5, housing: 9,
    // 课题组 4 轴
    poct: 9, sweat: 10, ai_ivd: 9, energy: 7,
    afm_boost: true,   // AFM 学术背景加分
    intern_path: null, // 无实习通道
    intro: '上海嘉定本土医疗影像龙头（688271.SH），PET/CT/MRI 大型设备国产替代核心。联影微电子事业部布局可穿戴医疗+生物传感，与王侃课题组研究方向（POCT + 汗液传感 + AI-IVD）完美对口。嘉定新城定居性价比天花板，交大校友密度全市前列。',
    why_for_you: [
      'AFM 学术背景 + 你 6 项专利 + EI 论文 → 联影研究院研究员岗位契合度 top 1',
      '王侃课题组 POCT/汗液传感方向 = 联影微电子事业部直接对口',
      '嘉定新城房价 4.0w/㎡，你宝山置换 + 父母支持可直接买 90㎡',
      '研究生双技术栈（嵌入式 + 电化学传感）在联影都有岗位承接',
      '交大系内推渠道成熟（研究院多位 PI 为交大校友）'
    ],
    current_match: '9.5 · 你现栈（STM32/FreeRTOS/TF Lite Micro/FPC）直接进可穿戴事业部',
    future_match: '9.8 · 研究生学的电化学/微针/POCT 在联影医疗电子研究院顶配匹配',
    pos: [
      {dept: '联影医疗电子研究院', jobs: ['可穿戴医疗设备嵌入式研究员', 'POCT 产品研发工程师']},
      {dept: '联影微电子事业部', jobs: ['嵌入式软件工程师（生物传感方向）']},
      {dept: '数字健康研究院', jobs: ['医疗 AIoT 系统架构师', '体征监护算法工程师']}
    ],
    adv: ['嘉定新城房价+公司区位双利', 'WLB 44h 医疗行业最佳', '交大校友内推密集', 'AFM 背景在研究院溢价显著'],
    risk: ['紧急项目偶有加班到 50h', '股票期权 3 年兑现周期', '管培生岗位竞争激烈'],
    source_url: 'https://global.united-imaging.com/zh-cn/careers',
    source: '联影 2026 校招公告 + 猎聘 + 交大就业指导',
    c_pay: '🟡', c_tech: '🟢', c_wlb: '🟡'
  },
  {
    id: 2, name: '华为 · 健康军团', en: 'Huawei Health Corps',
    cat: 'medical', subcat: '消费医疗穿戴',
    dist: '浦东新区', commute_jd: 3, commute_mh: 3,
    cash_low: 42, cash_high: 58, cash_mid: 50,
    fund_pct: 5, fund_total: 4.5, stock: 'TUP 激励 · 3-5年',
    total5y: 295,
    wlb_hours: 55,
    pay: 9.3, tech_now: 9.0, tech_future: 8.5, geo: 6.5, career: 9.5,
    wlb: 5.5, endow: 9.0, industry: 9.0, cohort: 8.5, housing: 7,
    poct: 7, sweat: 9, ai_ivd: 9, energy: 10,
    afm_boost: true,
    intern_path: null,
    intro: '华为可穿戴全球领先（Watch GT/D 系列出货量全球前三）。健康军团主攻 CGM、心率血氧、PPG 算法等。TUP 激励 5 年可增加 30-50% 总包，但现金薪资中等。华为 2012 实验室是你 AFM 研究出口的顶级平台。',
    why_for_you: [
      'PPG+TF Lite Micro+BLE 技术栈完美匹配（你毕设已实现）',
      'CGM 方向 = 王侃课题组 POCT 方向延伸',
      'TUP 长期兑现价值 5 年总包可达 300w+',
      '华为 2012 实验室医疗组是 AFM 研究延续的最好产业出口',
      '简历含金量天花板（校招华为 = 未来所有门槛通行证）'
    ],
    current_match: '9.0 · PPG+BLE+TF Lite 毕设技能高度对口',
    future_match: '8.5 · 电化学传感/微针在华为医疗偏边缘，但自供能方向完美匹配（指尖自泵）',
    pos: [
      {dept: '可穿戴设备研发部', jobs: ['传感器嵌入式工程师（PPG/ECG+BLE）', '低功耗固件工程师']},
      {dept: '健康算法部', jobs: ['边缘AI部署工程师（TF Lite Micro）']},
      {dept: '华为 2012 实验室医疗组', jobs: ['研究员（需发表顶刊）']}
    ],
    adv: ['薪资天花板', '技术栈 100% 匹配', 'TUP 长期价值', 'AFM 背景研究员岗通道'],
    risk: ['WLB 差 55+h', '公积金仅 5+5', '深圳为主上海岗位少', '大小周存在'],
    source_url: 'https://career.huawei.com',
    source: 'BOSS 直聘 20-40K×14 + 知乎 2025 校招解读',
    c_pay: '🟢', c_tech: '🟢', c_wlb: '🟢'
  },
  {
    id: 3, name: '迈瑞医疗', en: 'Mindray', ticker: '300760.SZ',
    cat: 'medical', subcat: '医疗器械龙头',
    dist: '闵行老闵行', commute_jd: 4, commute_mh: 5,
    cash_low: 32, cash_high: 44, cash_mid: 38,
    fund_pct: 6, fund_total: 6.5, stock: '期权·限制性股票',
    total5y: 225,
    wlb_hours: 46,
    pay: 7.8, tech_now: 9.2, tech_future: 8.5, geo: 9.0, career: 9.3,
    wlb: 7.5, endow: 8.5, industry: 9.2, cohort: 8.5, housing: 9,
    poct: 8, sweat: 6, ai_ivd: 8, energy: 5,
    afm_boost: true,
    intern_path: null,
    intro: '国产医疗器械绝对龙头，全球监护仪市占率 Top 3。闵行研发中心靠近交大徐汇校区，心率/血氧方向与你本科毕设（MAX30102+Kalman+1D-CNN）完美复用。迈瑞医疗研究院与王侃课题组 POCT 方向高度对口。',
    why_for_you: [
      '心率血氧方向 = 你本科毕设完美延续',
      'IEC 60601/62304 认证经验业内标杆',
      '闵行研发中心 = 老闵行买房 3.9w/㎡ 可负担',
      '上市公司稳定 + 全球龙头地位，35 岁+ 无焦虑',
      '监护仪嵌入式 + AI 部署 = 双技术栈都能用'
    ],
    current_match: '9.2 · 本科毕设 PPG/Kalman/1D-CNN/TF Lite 完全对口',
    future_match: '8.5 · POCT 方向延续，电化学传感偏辅助',
    pos: [
      {dept: '生命信息与支持事业部', jobs: ['监护仪嵌入式工程师（PPG+血压+血氧）', '生理参数测量工程师']},
      {dept: '体外诊断事业部（POCT）', jobs: ['POCT 设备嵌入式工程师']},
      {dept: '迈瑞医疗研究院', jobs: ['医疗 AI 算法工程师']}
    ],
    adv: ['毕设方向 100% 对口', '行业地位最稳固', '闵行定居可覆盖', 'IEC 认证经验壁垒'],
    risk: ['公积金偏低 6+6', 'R&D 偶有加班', '薪资天花板不如互联网'],
    source_url: 'https://www.mindray.com/cn/about-us/careers',
    source: '迈瑞官网 + 看准网 + 猎聘',
    c_pay: '🟡', c_tech: '🟢', c_wlb: '🟡'
  },
  {
    id: 4, name: '小米汽车', en: 'Xiaomi Auto', ticker: '1810.HK',
    cat: 'auto', subcat: '新能源汽车',
    dist: '嘉定新城', commute_jd: 5, commute_mh: 3,
    cash_low: 40, cash_high: 58, cash_mid: 49,
    fund_pct: 12, fund_total: 13.5, stock: '港股期权',
    total5y: 310,
    wlb_hours: 55,  // 你亲述太累太卷，上调
    pay: 9.0, tech_now: 8.5, tech_future: 5.5, geo: 9.5, career: 7.8,
    wlb: 5.0, endow: 7.5, industry: 8.5, cohort: 3.0, housing: 9,
    poct: 1, sweat: 2, ai_ivd: 5, energy: 4,
    afm_boost: false,
    intern_path: 'current_off_topic', // 实习在这但跨方向
    intern_boost: 0.5,                 // 大幅降权
    honest_feedback: '你的亲身实习反馈：太累太卷 · WLB 差 · 跨方向未发挥医疗电子特长',
    intro: '你正在小米汽车架构部实习（2026.2-2026.6），汽车 OS 团队。**⚠️ 重要：这是你亲身实习过的公司，反馈是"太累太卷、WLB 差、跨了汽车电子未发挥医疗电子特长"。** 所以它虽然薪资高定居好，但跟你主线方向有偏差，不再作为主推。',
    why_for_you: [
      '⚠️ 亲身实习反馈负面：WLB 差 + 医疗电子主线被稀释',
      '现栈匹配良好（CAN+AUTOSAR 用得上）但未来栈几乎用不上',
      '嘉定定居完美但需要你真心愿意做 5-10 年汽车',
      '转正作为保底 offer 可以有，但不是第一选择',
      '如愿押注汽车赛道，26届 C++ 嵌入式 378k 是透明 benchmark'
    ],
    current_match: '8.5 · 实习期间用的技术栈可继承',
    future_match: '5.5 · ⚠️ 研究生学的微针/电化学/POCT 在小米汽车完全用不上',
    pos: [
      {dept: '汽车 OS 架构部（你实习部门）', jobs: ['域控制器通信工程师（转正）', '嵌入式测试架构师']},
      {dept: '智能座舱部', jobs: ['车载嵌入式工程师（高通 8295+QNX）']},
      {dept: '自动驾驶部', jobs: ['域控制器嵌入式（需算法加强）']}
    ],
    adv: ['实习转正议价权顶级', '嘉定定居完美', '26 届薪资已透明化', '公积金 12+12'],
    risk: ['WLB 50h+ 偏卷', '纯汽车与医疗主线偏离', '港股波动'],
    source_url: 'https://hr.xiaomi.com',
    source: '🟢 你正在实习 + 知乎 26 届薪资 + 掘金 2025-03-14',
    c_pay: '🟢', c_tech: '🟢', c_wlb: '🟢'
  },
  {
    id: 5, name: '脑虎科技', en: 'NeuroXess',
    cat: 'startup', subcat: '脑机接口头部 · 非主线',
    dist: '闵行老闵行', commute_jd: 3, commute_mh: 5,
    cash_low: 32, cash_high: 42, cash_mid: 37,
    fund_pct: 8, fund_total: 8.8, stock: 'A 轮期权',
    total5y: 215,
    wlb_hours: 47,
    pay: 7.5, tech_now: 6.5, tech_future: 6.0, geo: 8.5, career: 6.5,
    wlb: 7.5, endow: 7.5, industry: 8.5, cohort: 5.0, housing: 8,
    poct: 3, sweat: 5, ai_ivd: 7, energy: 6,
    afm_boost: false,  // AFM 是王侃课题组的，不是脑机接口背景
    intern_path: null,
    intro: '柔性脑机接口头部初创，2022 年完成数亿元 A 轮。闵行办公通勤友好。**⚠️ 但：你的主线是医疗电子（POCT/微针/可穿戴），脑机接口不在你技术栈，也不在王侃课题组 4 大方向里** —— 所以这里只是个前沿选项，不是"背景延续"。',
    why_for_you: [
      '闵行通勤友好 + 老闵行 3.9w/㎡ 可负担',
      '前沿赛道简历加分',
      '⚠️ 不是你的技术栈方向（你简历没写脑机接口），需从零学习',
      '⚠️ 与王侃课题组 POCT/汗液/AI-IVD/自供能 四方向不重叠',
      '作为"猎奇选项"而非"主投路径"'
    ],
    current_match: '6.5 · 嵌入式通用技能匹配，脑电采集需从零',
    future_match: '6.0 · 研究生方向与脑机接口交集小',
    pos: [
      {dept: '电生理系统部', jobs: ['嵌入式软件工程师（脑电+FreeRTOS）', '柔性电极工程师']},
      {dept: '算法部', jobs: ['脑电信号解析工程师（1D-CNN 边缘部署）']},
      {dept: '柔性电子实验室（研究员岗）', jobs: ['柔性脑机接口研究员（AFM挂名加分）']}
    ],
    adv: ['实习背景直接延续', 'AFM 在研究员岗加分', '技术前沿 simly 高', '闵行通勤可达'],
    risk: ['初创融资周期风险', '平台规模有限', '商业化周期长'],
    source_url: 'https://www.neuroxess.com',
    source: '猎聘 12-20k·13薪 + 动脉网 + 36氪',
    c_pay: '🟡', c_tech: '🟢', c_wlb: '🟠'
  },
  {
    id: 6, name: '微创医疗机器人', en: 'MicroPort MedBot', ticker: '2252.HK',
    cat: 'medical', subcat: '手术机器人',
    dist: '张江', commute_jd: 2, commute_mh: 3,
    cash_low: 32, cash_high: 44, cash_mid: 38,
    fund_pct: 10, fund_total: 10.5, stock: '港股期权',
    total5y: 220,
    wlb_hours: 45,
    pay: 7.8, tech_now: 9.0, tech_future: 9.5, geo: 7.5, career: 8.5,
    wlb: 7.8, endow: 8.5, industry: 9.0, cohort: 9.0, housing: 6,
    poct: 8, sweat: 7, ai_ivd: 7, energy: 7,
    afm_boost: true,
    intern_path: null,
    intro: '港股 2252.HK，手术机器人国产龙头（图迈/鸿鹄）。可穿戴医疗事业部专攻**微针给药**和传感器系统，与王侃课题组研究方向完美对口。张江总部，薪资+期权组合优秀。',
    why_for_you: [
      '⭐ 微针给药方向 = 王侃课题组核心方向 100% 对口',
      'AFM 背景在可穿戴医疗事业部研究员岗溢价',
      '手术机器人 + 可穿戴医疗双赛道',
      'IEC 62304 认证经验可继承迈瑞路径',
      '张江办公配合总部资源'
    ],
    current_match: '9.0 · 低功耗 MCU+BLE 技术匹配',
    future_match: '9.5 · 微针+电化学+MEMS 完美匹配研究生方向',
    pos: [
      {dept: '可穿戴医疗事业部（微针方向）', jobs: ['嵌入式软件工程师（MCU+BLE）', '微针传感器系统工程师', '电化学/MEMS 工程师']},
      {dept: '手术机器人研发部', jobs: ['嵌入式控制系统工程师']}
    ],
    adv: ['微针方向课题组直接对口', 'WLB 优于华为', '港股期权长期价值', 'AFM 研究员通道'],
    risk: ['仍处亏损阶段', '张江房价偏高需 SP offer', '平台规模不及大厂'],
    source_url: 'https://www.microport.com.cn/careers',
    source: '公司官网 + 港交所 + 看准',
    c_pay: '🟡', c_tech: '🟢', c_wlb: '🟡'
  },
  {
    id: 7, name: '三诺生物', en: 'Sinocare', ticker: '300298.SZ',
    cat: 'medical', subcat: 'CGM 连续血糖',
    dist: '浦东新区', commute_jd: 3, commute_mh: 3,
    cash_low: 26, cash_high: 36, cash_mid: 31,
    fund_pct: 8, fund_total: 8.8, stock: '限制性股票',
    total5y: 190,
    wlb_hours: 43,
    pay: 6.5, tech_now: 8.5, tech_future: 9.7, geo: 7.5, career: 8.0,
    wlb: 8.0, endow: 8.5, industry: 9.0, cohort: 9.8, housing: 7,
    poct: 10, sweat: 9, ai_ivd: 8, energy: 6,
    afm_boost: true,
    intern_path: null,
    intro: '国产血糖监测龙头，CGM（连续血糖）国产替代。POCT + 电化学传感是王侃课题组核心方向，匹配度 10/10。虽然现金包偏低，但**课题组成果直接变现**的最佳去处。',
    why_for_you: [
      '⭐ CGM = POCT × 电化学传感 × 微针 × 可穿戴 四重契合王侃方向',
      '你 AFM 论文 + 王侃方向微针研究成果可直接发表/变现',
      '细分龙头，CGM 赛道 2029 将大爆发',
      '上海研究院研究员岗位可继续做科研',
      '为 PhD 路径留出窗口'
    ],
    current_match: '8.5 · 嵌入式 + BLE + 低功耗匹配',
    future_match: '9.7 · 电化学/微针/CGM 完美匹配研究生方向（课题组契合最高）',
    pos: [
      {dept: 'CGM 产品研发部', jobs: ['CGM 嵌入式开发工程师', '微针可穿戴传感工程师（与课题组直接对口）']},
      {dept: '智能算法部', jobs: ['血糖预测算法工程师（AI-IVD 方向）']},
      {dept: '上海研究院', jobs: ['CGM 研究员（适合 AFM 背景）']}
    ],
    adv: ['课题组方向 100% 对口', '细分龙头', '研究员岗 AFM 加分', 'WLB 极佳'],
    risk: ['现金包偏低 26-36w', '总部长沙上海岗位有限', '体量小'],
    source_url: 'https://www.sinocare.com',
    source: '公司官网 + 招股书',
    c_pay: '🟡', c_tech: '🟢', c_wlb: '🟠'
  },
  {
    id: 8, name: '英伟达上海', en: 'NVIDIA Shanghai', ticker: 'NVDA',
    cat: 'aiot', subcat: '全球 AI 算力',
    dist: '张江', commute_jd: 3, commute_mh: 3,
    cash_low: 50, cash_high: 85, cash_mid: 67.5,
    fund_pct: 12, fund_total: 13.5, stock: 'RSU · 大量',
    total5y: 480,
    wlb_hours: 42,
    pay: 10, tech_now: 8.5, tech_future: 7.5, geo: 8.5, career: 9.8,
    wlb: 9.0, endow: 10, industry: 10, cohort: 4, housing: 5,
    poct: 3, sweat: 5, ai_ivd: 8, energy: 6,
    afm_boost: true,
    intern_path: null,
    intro: '全球 AI 算力龙头，股价 2 年涨 10 倍。上海张江研发中心是嵌入式 AI 天花板，Jetson 平台黄金组合。门槛最高但回报最高的一家。',
    why_for_you: [
      'AFM 挂名 + EI 一作 + 985 硕 → 够门槛投 NVIDIA',
      'RSU 5 年预期 280-380w（叠加股价上涨）',
      'Jetson 嵌入式 AI 部署 + 你 TF Lite Micro 背景可迁移',
      '简历含金量天花板（一辈子通行证）',
      '外企 WLB 良好'
    ],
    current_match: '8.5 · 嵌入式 AI 部署技术栈匹配',
    future_match: '7.5 · 研究生方向偏生物传感，与 GPU 算力弱相关',
    pos: [
      {dept: 'Jetson 嵌入式平台部', jobs: ['嵌入式 AI 系统工程师']},
      {dept: '自动驾驶部', jobs: ['CUDA 嵌入式部署工程师']}
    ],
    adv: ['薪资天花板 + RSU 爆仓潜力', 'WLB 外企级', '简历含金量最高'],
    risk: ['录取难度天花板级', '中美关系不确定性', '英语面试要求极高', '张江房价 9.5w/㎡ 需 SP+'],
    source_url: 'https://nvidia.wd5.myworkdayjobs.com',
    source: 'Levels.fyi + 一亩三分地',
    c_pay: '🟢', c_tech: '🟡', c_wlb: '🟡'
  },
  {
    id: 9, name: '恒玄科技', en: 'BES Technic', ticker: '688608.SH',
    cat: 'aiot', subcat: '可穿戴芯片龙头',
    dist: '临港', commute_jd: 2, commute_mh: 2,
    cash_low: 32, cash_high: 44, cash_mid: 38,
    fund_pct: 10, fund_total: 10.5, stock: '限制性股票',
    total5y: 230,
    wlb_hours: 47,
    pay: 7.8, tech_now: 9.2, tech_future: 8.0, geo: 6.5, career: 8.5,
    wlb: 7.0, endow: 8.5, industry: 9.0, cohort: 7.5, housing: 7,
    poct: 5, sweat: 8, ai_ivd: 7, energy: 9,
    afm_boost: false,
    intern_path: null,
    intro: '全球智能可穿戴音频芯片龙头，TWS 耳机/智能手表芯片国内市占率第一。低功耗嵌入式与你技术栈完美对口。',
    why_for_you: [
      '可穿戴芯片龙头 = 医疗可穿戴硬件基础',
      '低功耗嵌入式完美对口你技术栈',
      '科创板上市后薪资水涨船高',
      '自供能方向（课题组方向 4）芯片级解决方案'
    ],
    current_match: '9.2 · 低功耗 MCU + BLE + 音频芯片匹配',
    future_match: '8.0 · 芯片层与课题组材料方向间隔',
    pos: [
      {dept: '芯片设计部', jobs: ['SoC 嵌入式验证工程师']},
      {dept: '应用工程部', jobs: ['可穿戴设备固件工程师']}
    ],
    adv: ['可穿戴芯片龙头', '技术栈匹配', '股价持续上涨'],
    risk: ['临港通勤远（需买房临港）', '消费电子周期性', '非医疗核心'],
    source_url: 'https://www.bestechnic.com',
    source: '公司官网 + 招股书',
    c_pay: '🟠', c_tech: '🟢', c_wlb: '🟠'
  },
  {
    id: 10, name: '博睿康医疗', en: 'BrainCo',
    cat: 'medical', subcat: '脑机接口前沿 · 非主线',
    dist: '浦东新区', commute_jd: 3, commute_mh: 3,
    cash_low: 33, cash_high: 42, cash_mid: 37.5,
    fund_pct: 8, fund_total: 8.8, stock: '期权',
    total5y: 220,
    wlb_hours: 47,
    pay: 7.5, tech_now: 6.5, tech_future: 6.0, geo: 7.0, career: 6.5,
    wlb: 7.5, endow: 7.5, industry: 8.5, cohort: 4.5, housing: 7,
    poct: 4, sweat: 5, ai_ivd: 7, energy: 6,
    afm_boost: false,
    intern_path: null,
    intro: '全球首款获批植入式脑机接口，清华孵化。**⚠️ 同样不在你主线：脑机接口未在你技术栈，不在王侃课题组四方向**。作为前沿赛道了解即可。',
    why_for_you: [
      '全球首款植入 BCI 光环',
      '清华系人脉可能对接',
      '⚠️ 植入式 BCI 与你 POCT/微针方向交集有限',
      '⚠️ 需从零学脑电算法，技术栈重建成本高'
    ],
    current_match: '6.5 · 嵌入式技能通用匹配，脑电专业需从零',
    future_match: '6.0 · 植入式与你可穿戴医疗方向有差异',
    pos: [
      {dept: '脑机接口事业部', jobs: ['植入式神经信号采集嵌入式工程师', '穿戴式康复设备工程师']},
      {dept: '算法部', jobs: ['神经信号处理算法工程师']}
    ],
    adv: ['首款获批 BCI', '与实习背景对口', 'AFM 加分'],
    risk: ['初创阶段', '商业化周期长', '上海非总部'],
    source_url: 'https://www.brainco.tech',
    source: '动脉网 + 36氪',
    c_pay: '🟡', c_tech: '🟢', c_wlb: '🟠'
  },

  // ═══ Tier S 候选 (id 11-20) ═══
  {
    id: 11, name: '地平线', en: 'Horizon Robotics',
    cat: 'auto', subcat: '自动驾驶芯片',
    dist: '张江', commute_jd: 3, commute_mh: 3,
    cash_low: 36, cash_high: 50, cash_mid: 43,
    fund_pct: 10, fund_total: 10.5, stock: 'Pre-IPO 期权',
    total5y: 265, wlb_hours: 50,
    pay: 8.3, tech_now: 8.5, tech_future: 7.0, geo: 7.5, career: 8.8,
    wlb: 6.5, endow: 8.5, industry: 8.5, cohort: 4.5, housing: 6,
    poct: 2, sweat: 4, ai_ivd: 7, energy: 5,
    afm_boost: false,
    intern_path: null,
    intro: '自动驾驶芯片独角兽（冲击港股 IPO），征程系列车规级芯片广泛装车。',
    why_for_you: ['AI 芯片独角兽 Pre-IPO 期权', '上海张江办公', '小米汽车实习可迁移'],
    current_match: '8.5 · SoC+AI 部署匹配',
    future_match: '7.0 · 车规偏硬件与生物医疗方向间隔',
    pos: [
      {dept: '芯片系统集成部', jobs: ['SoC 嵌入式工程师']},
      {dept: 'BPU 算法部', jobs: ['AI 部署工程师（TensorRT+CUDA）']}
    ],
    adv: ['AI 芯片独角兽', 'Pre-IPO 期权', '技术深度'],
    risk: ['WLB 一般', 'IPO 时间不确定'],
    source_url: 'https://www.horizon.auto',
    source: '公司官网 + 脉脉',
    c_pay: '🟡', c_tech: '🟡', c_wlb: '🟡'
  },
  {
    id: 12, name: '西门子医疗', en: 'Siemens Healthineers',
    cat: 'medical', subcat: '外企医疗影像',
    dist: '浦东周浦', commute_jd: 3, commute_mh: 3,
    cash_low: 32, cash_high: 42, cash_mid: 37,
    fund_pct: 12, fund_total: 13.5, stock: '少量 RSU',
    total5y: 235, wlb_hours: 40,
    pay: 7.8, tech_now: 7.8, tech_future: 7.5, geo: 7.5, career: 7.8,
    wlb: 9.8, endow: 8.0, industry: 8.5, cohort: 6.5, housing: 8,
    poct: 6, sweat: 6, ai_ivd: 7, energy: 5,
    afm_boost: true,
    intern_path: null,
    intro: '全球医疗影像三巨头之一，上海周浦基地。WLB 顶级 + 公积金顶格。',
    why_for_you: ['WLB 40h 行业最佳', '公积金 12+12', '国际化平台', 'AFM 背景可投研发团队'],
    current_match: '7.8 · 系统控制软件+嵌入式匹配',
    future_match: '7.5 · 偏大设备与可穿戴微针方向间隔',
    pos: [
      {dept: '医疗设备研发部', jobs: ['系统控制软件工程师（CT/MRI）', '医疗设备嵌入式开发']},
      {dept: '超声产品部', jobs: ['超声信号处理嵌入式']}
    ],
    adv: ['WLB 最佳', '国际化', '公积金顶格'],
    risk: ['外企天花板', '晋升慢', '全球重组风险'],
    source_url: 'https://jobs.siemens-healthineers.com',
    source: '官方招聘 + 看准',
    c_pay: '🟡', c_tech: '🟡', c_wlb: '🟢'
  },
  {
    id: 13, name: '鱼跃医疗', en: 'Yuwell',
    cat: 'medical', subcat: '家用医疗器械',
    dist: '闵行老闵行', commute_jd: 4, commute_mh: 5,
    cash_low: 28, cash_high: 38, cash_mid: 33,
    fund_pct: 11, fund_total: 12.3, stock: '期权',
    total5y: 205, wlb_hours: 41,
    pay: 7.0, tech_now: 8.0, tech_future: 8.0, geo: 9.5, career: 7.5,
    wlb: 9.5, endow: 7.5, industry: 8.0, cohort: 7.5, housing: 9,
    poct: 8, sweat: 7, ai_ivd: 6, energy: 7,
    afm_boost: false,
    intern_path: null,
    intro: '家用医疗器械龙头，老龄化大趋势受益者。闵行研发中心 + WLB 极佳 + 公积金 11+11。',
    why_for_you: ['闵行定居超友好', 'WLB 41h 极佳', '家用医疗与可穿戴延伸', '课题组 POCT+汗液方向中等契合'],
    current_match: '8.0 · 血压血氧 BLE 匹配',
    future_match: '8.0 · POCT 家用场景延伸',
    pos: [
      {dept: '智能健康设备研发部', jobs: ['家用健康设备嵌入式工程师', 'IoT 系统工程师']}
    ],
    adv: ['WLB 41h', '闵行定居+公积金 11+11', '稳定性好'],
    risk: ['现金包偏低', '技术前沿性一般'],
    source_url: 'https://www.yuwell.com.cn',
    source: '公司官网 + 看准',
    c_pay: '🟡', c_tech: '🟡', c_wlb: '🟢'
  },
  {
    id: 14, name: '中科院上海微系统所', en: 'SIMIT, CAS',
    cat: 'soe', subcat: '国家研究所', tag: '⭐隐藏福地',
    dist: '长宁', commute_jd: 2, commute_mh: 3,
    cash_low: 22, cash_high: 30, cash_mid: 26,
    fund_pct: 12, fund_total: 13.5, stock: 'none',
    housing_bonus: '博后公寓+安家补贴10w',
    total5y: 190, wlb_hours: 45,
    pay: 5.8, tech_now: 7.5, tech_future: 9.8, geo: 8.5, career: 9.0,
    wlb: 8.5, endow: 9.8, industry: 9.5, cohort: 9.8, housing: 7,
    poct: 9, sweat: 10, ai_ivd: 7, energy: 9,
    afm_boost: true,
    intern_path: null,
    intro: '中国科学院上海微系统所，MEMS + 柔性电子 + 可穿戴国家队。王侃课题组方向最直接对口的产业链出口。',
    why_for_you: [
      '⭐ MEMS + 柔性可穿戴 + 自供能三重完美匹配王侃方向',
      'AFM + 6 专利 + EI → 助理研究员岗位直通',
      '可在职博士/工程博士路径',
      '事业编制 + 人才公寓',
      '学术圈对交大仪科背景极度认可'
    ],
    current_match: '7.5 · 偏学术，嵌入式工程偏应用',
    future_match: '9.8 · MEMS/柔性/微针/自供能完美匹配',
    pos: [
      {dept: 'MEMS 实验室', jobs: ['MEMS 传感器研发工程师', '助理研究员']},
      {dept: '柔性电子研究部', jobs: ['柔性可穿戴系统工程师', '研究员通道']}
    ],
    adv: ['技术契合度顶级', '学术资源', '可转博', '事业编'],
    risk: ['薪资偏低 22-30w', '偏学术路径'],
    source_url: 'http://www.sim.cas.cn',
    source: '中科院招聘',
    c_pay: '🟠', c_tech: '🟢', c_wlb: '🟡'
  },
  {
    id: 15, name: '瑞金医院 · 生物医学工程部', en: 'Ruijin Hospital BME',
    cat: 'hospital', subcat: '交大系三甲', tag: '⭐隐藏福地',
    dist: '黄浦', commute_jd: 2, commute_mh: 3,
    cash_low: 18, cash_high: 28, cash_mid: 23,
    fund_pct: 12, fund_total: 13.5, stock: 'none',
    housing_bonus: '医院人才公寓',
    total5y: 170, wlb_hours: 40,
    pay: 4.8, tech_now: 8.5, tech_future: 9.5, geo: 9.0, career: 9.0,
    wlb: 9.5, endow: 9.8, industry: 9.0, cohort: 9.5, housing: 5,
    poct: 9, sweat: 7, ai_ivd: 8, energy: 6,
    afm_boost: true,
    intern_path: null,
    intro: '交大医学院附属瑞金医院临床研究中心/工程部。蓝海选项，转化医学 + 医工交叉。你的 6 项发明专利 + AFM 论文可直接变现为医院科研项目。',
    why_for_you: [
      '⭐ 蓝海路径：99% 同学没考虑过但适合度极高',
      'AFM + 专利 6 项 → 医院科研基金申报通过率 top',
      '事业编制 + 可在职博士 + 临床转化',
      '交大系内部流通，人脉天然',
      'WLB 40h + 医院绿色通道'
    ],
    current_match: '8.5 · 医疗嵌入式 + 设备维护匹配',
    future_match: '9.5 · POCT/微针/电化学在临床转化最前线',
    pos: [
      {dept: '临床研究中心·工程组', jobs: ['医学工程师（研发+临床）']},
      {dept: '医工转化中心', jobs: ['医疗仪器研发工程师（科研岗）']}
    ],
    adv: ['事业编+人才公寓', '交大医学院系统', '你的科研能直接变现', 'WLB 40h'],
    risk: ['薪资较低 18-28w', '偏体制化'],
    source_url: 'https://www.rjh.com.cn',
    source: '医院人才招聘 + 交大医学院',
    c_pay: '🟠', c_tech: '🟡', c_wlb: '🟡'
  },
  {
    id: 16, name: '中国商飞', en: 'COMAC',
    cat: 'soe', subcat: '央企航空', tag: '⭐隐藏福地',
    dist: '浦东新区', commute_jd: 4, commute_mh: 3,
    cash_low: 23, cash_high: 30, cash_mid: 26.5,
    fund_pct: 12, fund_total: 13.5, stock: 'none',
    housing_bonus: '住房补贴 1000-3000 元/月 + 人才公寓 5 年',
    total5y: 200, wlb_hours: 40,
    pay: 5.8, tech_now: 7.0, tech_future: 6.0, geo: 9.5, career: 9.0,
    wlb: 10, endow: 8.5, industry: 9.5, cohort: 3, housing: 9,
    poct: 2, sweat: 3, ai_ivd: 5, energy: 4,
    afm_boost: false,
    intern_path: null,
    intro: '央企大飞机龙头。WLB 顶级 955，住房补贴 + 人才公寓 + 稳定性王者。',
    why_for_you: ['WLB 40h 顶级 955', '人才公寓 5 年', '央企稳定性 35岁+ 无焦虑', 'C919 战略地位'],
    current_match: '7.0 · 机载嵌入式偏传统',
    future_match: '6.0 · 与可穿戴医疗方向偏离',
    pos: [
      {dept: '上飞院·航电系统部', jobs: ['嵌入式软件工程师（机载）']},
      {dept: '商飞时代航空', jobs: ['底层嵌入式工程师']}
    ],
    adv: ['央企稳定', '955 WLB', '补贴+公寓'],
    risk: ['薪资偏低', '与医疗方向不匹配', '偏保守'],
    source_url: 'https://www.comac.cc',
    source: '公司招聘公告',
    c_pay: '🟢', c_tech: '🟡', c_wlb: '🟢'
  },
  {
    id: 17, name: '中电科 32 所', en: 'CETC 32nd',
    cat: 'soe', subcat: '央企研究所', tag: '⭐隐藏福地',
    dist: '闵行老闵行', commute_jd: 4, commute_mh: 5,
    cash_low: 28, cash_high: 36, cash_mid: 32,
    fund_pct: 12, fund_total: 13.5, stock: 'none',
    housing_bonus: '安家费 15 万 + 人才公寓 5 年 + 事业编',
    total5y: 225, wlb_hours: 44,
    pay: 7.0, tech_now: 8.0, tech_future: 7.5, geo: 10, career: 8.5,
    wlb: 9.0, endow: 8.5, industry: 8.0, cohort: 5.5, housing: 10,
    poct: 5, sweat: 4, ai_ivd: 7, energy: 5,
    afm_boost: true,
    intern_path: null,
    intro: '中国电科核心研究所（华东计算所）。闵行办公，安家费 15 万，5 年人才公寓，事业编制。',
    why_for_you: [
      '事业编 + 安家费 15 万 + 闵行公寓 = 定居一步到位',
      '国产 RTOS 开发与你 FreeRTOS 背景匹配',
      '医疗电子事业部对口',
      'AFM 背景在研究员岗有竞争力'
    ],
    current_match: '8.0 · RTOS + 嵌入式匹配',
    future_match: '7.5 · 医疗电子事业部可延续',
    pos: [
      {dept: '嵌入式操作系统事业部', jobs: ['国产 RTOS 开发工程师']},
      {dept: '医疗电子事业部', jobs: ['医疗设备嵌入式系统工程师']}
    ],
    adv: ['事业编+安家费15万', '闵行办公', '医疗电子方向'],
    risk: ['薪资偏低', '技术迭代慢'],
    source_url: 'https://www.ecit.com.cn',
    source: '中电科招聘公告',
    c_pay: '🟢', c_tech: '🟡', c_wlb: '🟡'
  },
  {
    id: 18, name: '智己汽车', en: 'IM Motors',
    cat: 'auto', subcat: '上汽高端',
    dist: '嘉定安亭', commute_jd: 5, commute_mh: 3,
    cash_low: 33, cash_high: 45, cash_mid: 39,
    fund_pct: 12, fund_total: 13.5, stock: '股权激励',
    total5y: 240, wlb_hours: 48,
    pay: 7.5, tech_now: 8.0, tech_future: 6.5, geo: 9.0, career: 8.0,
    wlb: 7.0, endow: 7.8, industry: 7.5, cohort: 4, housing: 9,
    poct: 2, sweat: 4, ai_ivd: 6, energy: 5,
    afm_boost: false,
    intern_path: null,
    intro: '上汽高端新能源品牌。嘉定安亭定居高，公积金 12+12。',
    why_for_you: ['嘉定安亭 2.9w/㎡ 置换最轻松', '公积金 12+12', '上汽集团稳定性'],
    current_match: '8.0 · 域控制器+通信匹配',
    future_match: '6.5 · 汽车与医疗方向偏离',
    pos: [
      {dept: '智能驾驶事业部', jobs: ['域控制器嵌入式工程师']},
      {dept: '电子电器架构部', jobs: ['车载通信协议工程师']}
    ],
    adv: ['嘉定安亭定居最省钱', '公积金顶格'],
    risk: ['销量波动', '非医疗核心'],
    source_url: 'https://www.immotors.com',
    source: '猎聘 + BOSS 直聘',
    c_pay: '🟠', c_tech: '🟡', c_wlb: '🟠'
  },
  {
    id: 19, name: '华为海思', en: 'HiSilicon',
    cat: 'aiot', subcat: '芯片设计',
    dist: '浦东新区', commute_jd: 3, commute_mh: 3,
    cash_low: 42, cash_high: 56, cash_mid: 49,
    fund_pct: 5, fund_total: 4.5, stock: 'TUP',
    total5y: 285, wlb_hours: 55,
    pay: 8.5, tech_now: 7.0, tech_future: 6.0, geo: 7.0, career: 9.5,
    wlb: 5.5, endow: 9.0, industry: 9.0, cohort: 5, housing: 7,
    poct: 3, sweat: 4, ai_ivd: 7, energy: 7,
    afm_boost: false,
    intern_path: null,
    intro: '国产芯片设计绝对核心。',
    why_for_you: ['芯片设计顶级平台', '简历含金量极高'],
    current_match: '7.0 · 芯片验证偏底层',
    future_match: '6.0 · 材料生物方向不匹配',
    pos: [
      {dept: 'IoT 芯片设计部', jobs: ['嵌入式 SoC 验证工程师']}
    ],
    adv: ['芯片设计顶级', '简历加分'],
    risk: ['WLB 差', '公积金低', '与医疗偏差'],
    source_url: 'https://career.huawei.com',
    source: '华为官网 + 知乎',
    c_pay: '🟡', c_tech: '🟡', c_wlb: '🟢'
  },
  {
    id: 20, name: '微泰医疗', en: 'MicroTech Medical',
    cat: 'medical', subcat: '可穿戴胰岛素+CGM',
    dist: '浦东新区', commute_jd: 3, commute_mh: 3,
    cash_low: 24, cash_high: 34, cash_mid: 29,
    fund_pct: 8, fund_total: 8.8, stock: '港股期权',
    total5y: 180, wlb_hours: 44,
    pay: 6.0, tech_now: 8.0, tech_future: 9.5, geo: 7.0, career: 7.0,
    wlb: 8.0, endow: 7.5, industry: 8.5, cohort: 9.3, housing: 6,
    poct: 9, sweat: 8, ai_ivd: 7, energy: 7,
    afm_boost: true,
    intern_path: null,
    intro: '可穿戴胰岛素泵 + CGM 双赛道。课题组契合度极高但平台偏小。',
    why_for_you: ['CGM + 胰岛素泵 = 可穿戴医疗典型', '课题组 POCT+微针完美延伸'],
    current_match: '8.0 · 嵌入式+BLE+低功耗',
    future_match: '9.5 · CGM+胰岛素泵+微针完美匹配',
    pos: [
      {dept: 'CGM 研发', jobs: ['CGM 嵌入式工程师', '微针传感方向']}
    ],
    adv: ['可穿戴医疗细分', '课题组完美契合'],
    risk: ['港股波动', '平台小'],
    source_url: 'https://www.microtechmd.com',
    source: '公司官网',
    c_pay: '🟠', c_tech: '🟡', c_wlb: '🟠'
  },

  // ═══ Tier A/B 候选 (id 21-40)  · 精简数据，不展开 ═══
  {id:21,name:'华大智造',en:'MGI Tech',ticker:'688114.SH',cat:'medical',subcat:'基因测序+医疗',dist:'浦东新区',commute_jd:3,commute_mh:3,cash_low:28,cash_high:40,cash_mid:34,fund_pct:10,fund_total:10.5,stock:'限制性股票',total5y:215,wlb_hours:45,pay:7.0,tech_now:8.2,tech_future:8.5,geo:7.5,career:8.0,wlb:8.0,endow:8.0,industry:8.5,cohort:8.0,housing:7,poct:9,sweat:5,ai_ivd:8,energy:5,afm_boost:true,intern_path:null,intro:'基因测序+医疗设备龙头。POCT 方向与课题组对口。',why_for_you:['POCT 方向对口','科创板龙头'],current_match:'8.2',future_match:'8.5',pos:[{dept:'设备研发部',jobs:['测序仪嵌入式工程师']}],adv:['科创板龙头','POCT 对口'],risk:['基因测序周期性'],source_url:'https://en.mgi-tech.com',source:'公司官网',c_pay:'🟡',c_tech:'🟡',c_wlb:'🟡'},
  {id:22,name:'阶跃星辰',en:'StepFun',cat:'startup',subcat:'AI 大模型',dist:'徐汇',commute_jd:3,commute_mh:3,cash_low:40,cash_high:60,cash_mid:50,fund_pct:10,fund_total:10.5,stock:'SAFE 期权',total5y:305,wlb_hours:52,pay:8.5,tech_now:7.0,tech_future:6.5,geo:8.0,career:8.5,wlb:6.5,endow:8.0,industry:9.0,cohort:4,housing:7,poct:2,sweat:3,ai_ivd:8,energy:3,afm_boost:false,intern_path:null,intro:'上海 AI 大模型独角兽。',why_for_you:['薪资高','独角兽期权'],current_match:'7.0',future_match:'6.5',pos:[{dept:'基础设施部',jobs:['嵌入式 AI 部署']}],adv:['AI 独角兽'],risk:['偏算法'],source_url:'https://www.stepfun.com',source:'招聘公告',c_pay:'🟠',c_tech:'🟠',c_wlb:'🟠'},
  {id:23,name:'航天八院 804 所',en:'SAST 804th',cat:'soe',subcat:'央企军工',tag:'⭐隐藏福地',dist:'闵行老闵行',commute_jd:4,commute_mh:5,cash_low:27,cash_high:35,cash_mid:31,fund_pct:12,fund_total:13.5,stock:'none',housing_bonus:'安家费15万+人才公寓5年+事业编',total5y:220,wlb_hours:44,pay:6.8,tech_now:7.0,tech_future:6.5,geo:10,career:8.3,wlb:9.0,endow:8.3,industry:7.8,cohort:4,housing:10,poct:3,sweat:3,ai_ivd:6,energy:5,afm_boost:false,intern_path:null,intro:'航天科技集团八院核心所。闵行办公。',why_for_you:['事业编+安家费15万'],current_match:'7.0',future_match:'6.5',pos:[{dept:'嵌入式系统研发部',jobs:['嵌入式系统工程师']}],adv:['事业编'],risk:['保密'],source_url:'https://www.sast-space.com',source:'航天招聘',c_pay:'🟡',c_tech:'🟡',c_wlb:'🟡'},
  {id:24,name:'仁济医院 · 生物医学工程部',en:'Renji BME',cat:'hospital',subcat:'交大系三甲',tag:'⭐隐藏福地',dist:'浦东新区',commute_jd:3,commute_mh:3,cash_low:18,cash_high:28,cash_mid:23,fund_pct:12,fund_total:13.5,stock:'none',housing_bonus:'医院人才公寓',total5y:165,wlb_hours:40,pay:4.5,tech_now:8.0,tech_future:9.0,geo:9.0,career:8.8,wlb:9.5,endow:9.5,industry:8.8,cohort:9.0,housing:5,poct:9,sweat:7,ai_ivd:7,energy:6,afm_boost:true,intern_path:null,intro:'交大医学院附属仁济医院生物医学工程部。',why_for_you:['交大系事业编','AFM 变现'],current_match:'8.0',future_match:'9.0',pos:[{dept:'生物医学工程部',jobs:['临床工程师']}],adv:['事业编','交大系'],risk:['薪资低'],source_url:'https://www.renji.com',source:'医院招聘',c_pay:'🟠',c_tech:'🟡',c_wlb:'🟡'},
  {id:25,name:'蔚来汽车',en:'NIO',cat:'auto',subcat:'新能源',dist:'嘉定新城',commute_jd:5,commute_mh:3,cash_low:34,cash_high:48,cash_mid:41,fund_pct:5,fund_total:4.5,stock:'美股期权',total5y:245,wlb_hours:48,pay:7.5,tech_now:8.0,tech_future:6.0,geo:9.0,career:8.0,wlb:7.0,endow:7.5,industry:7.5,cohort:3,housing:8,poct:1,sweat:3,ai_ivd:5,energy:5,afm_boost:false,intern_path:null,intro:'高端电动车标杆。',why_for_you:['嘉定定居','全栈自研'],current_match:'8.0',future_match:'6.0',pos:[{dept:'智能座舱',jobs:['座舱域控制器']}],adv:['嘉定定居'],risk:['公积金低'],source_url:'https://www.nio.com/careers',source:'公司官网',c_pay:'🟡',c_tech:'🟡',c_wlb:'🟡'},
  {id:26,name:'理想汽车',en:'Li Auto',cat:'auto',subcat:'新能源',dist:'浦东新区',commute_jd:3,commute_mh:3,cash_low:35,cash_high:48,cash_mid:41.5,fund_pct:12,fund_total:13.5,stock:'美股期权',total5y:255,wlb_hours:50,pay:8.0,tech_now:7.5,tech_future:6.0,geo:7.5,career:8.5,wlb:6.5,endow:7.5,industry:7.5,cohort:4,housing:7,poct:1,sweat:3,ai_ivd:7,energy:5,afm_boost:false,intern_path:null,intro:'新势力销量头部。',why_for_you:['销量稳定','公积金顶格'],current_match:'7.5',future_match:'6.0',pos:[{dept:'智能座舱',jobs:['座舱系统']}],adv:['公积金 12+12'],risk:['WLB 偏低'],source_url:'https://careers.lixiang.com',source:'公司官网',c_pay:'🟡',c_tech:'🟡',c_wlb:'🟡'},
  {id:27,name:'美敦力',en:'Medtronic',cat:'medical',subcat:'外企医疗',dist:'闵行老闵行',commute_jd:4,commute_mh:5,cash_low:28,cash_high:38,cash_mid:33,fund_pct:12,fund_total:13.5,stock:'RSU',total5y:210,wlb_hours:40,pay:7.0,tech_now:7.8,tech_future:8.5,geo:8.5,career:7.5,wlb:9.8,endow:8.0,industry:8.0,cohort:8.5,housing:8,poct:8,sweat:5,ai_ivd:6,energy:7,afm_boost:true,intern_path:null,intro:'全球医疗器械第一大公司。心脏节律、神经调控、糖尿病可穿戴全覆盖。',why_for_you:['WLB 顶级','IEC 62304 经验','AFM 在研发岗加分'],current_match:'7.8',future_match:'8.5',pos:[{dept:'心脏节律管理部',jobs:['嵌入式电子工程师']}],adv:['WLB 顶级','国际化'],risk:['外企天花板'],source_url:'https://jobs.medtronic.com',source:'官方招聘 + 脉脉',c_pay:'🟡',c_tech:'🟡',c_wlb:'🟢'},
  {id:28,name:'强生医疗',en:'Johnson & Johnson Medical',cat:'medical',subcat:'外企医疗',dist:'浦东新区',commute_jd:3,commute_mh:3,cash_low:28,cash_high:38,cash_mid:33,fund_pct:12,fund_total:13.5,stock:'RSU',total5y:210,wlb_hours:40,pay:7.2,tech_now:7.0,tech_future:7.5,geo:7.0,career:7.5,wlb:9.8,endow:7.8,industry:8.0,cohort:7,housing:7,poct:7,sweat:5,ai_ivd:6,energy:5,afm_boost:true,intern_path:null,intro:'全球最大医疗器械+药品公司。',why_for_you:['WLB 顶级','国际平台'],current_match:'7.0',future_match:'7.5',pos:[{dept:'医疗器械部',jobs:['嵌入式工程师']}],adv:['WLB 顶级'],risk:['外企天花板'],source_url:'https://www.careers.jnj.com',source:'官方招聘',c_pay:'🟠',c_tech:'🟠',c_wlb:'🟡'},
  {id:29,name:'英特尔上海',en:'Intel Shanghai',cat:'aiot',subcat:'外企芯片',dist:'闵行老闵行',commute_jd:4,commute_mh:5,cash_low:30,cash_high:42,cash_mid:36,fund_pct:12,fund_total:13.5,stock:'RSU',total5y:225,wlb_hours:40,pay:7.5,tech_now:7.5,tech_future:6.5,geo:9.0,career:7.5,wlb:9.5,endow:8.0,industry:7.0,cohort:4,housing:8,poct:2,sweat:3,ai_ivd:6,energy:5,afm_boost:false,intern_path:null,intro:'英特尔上海紫竹研发中心。',why_for_you:['紫竹（闵行）定居完美','公积金顶格'],current_match:'7.5',future_match:'6.5',pos:[{dept:'IoT 事业部',jobs:['嵌入式软件']}],adv:['闵行定居+公积金顶格'],risk:['业务下行'],source_url:'https://jobs.intel.com',source:'官方招聘',c_pay:'🟡',c_tech:'🟡',c_wlb:'🟡'},
  {id:30,name:'奕瑞科技',en:'iRay',ticker:'688301.SH',cat:'medical',subcat:'X射线探测器',dist:'嘉定新城',commute_jd:5,commute_mh:3,cash_low:28,cash_high:36,cash_mid:32,fund_pct:8,fund_total:8.8,stock:'期权',total5y:195,wlb_hours:43,pay:6.8,tech_now:7.5,tech_future:7.0,geo:9.0,career:7.5,wlb:8.0,endow:6.5,industry:8.0,cohort:5,housing:9,poct:4,sweat:3,ai_ivd:6,energy:5,afm_boost:false,intern_path:null,intro:'X射线探测器全球龙头，嘉定总部。',why_for_you:['嘉定总部定居','医疗影像细分龙头'],current_match:'7.5',future_match:'7.0',pos:[{dept:'探测器研发',jobs:['X 射线探测器嵌入式']}],adv:['嘉定定居'],risk:['业务窄'],source_url:'https://www.iraychina.com',source:'公司官网',c_pay:'🟠',c_tech:'🟡',c_wlb:'🟠'},

  // ═══ Tier B 候选 (id 31-50) · 仅核心数据 ═══
  {id:31,name:'阶梯医疗',en:'Stairmed',cat:'startup',subcat:'脑机接口 · 非主线',dist:'徐汇',commute_jd:3,commute_mh:3,cash_low:28,cash_high:38,cash_mid:33,fund_pct:8,fund_total:8.8,stock:'期权',total5y:195,wlb_hours:48,pay:6.8,tech_now:6.0,tech_future:5.5,geo:7.0,career:6.0,wlb:7.0,endow:7.0,industry:8.0,cohort:4,housing:7,poct:3,sweat:4,ai_ivd:6,energy:5,afm_boost:false,intern_path:null,intro:'脑机接口新锐，复旦孵化。⚠️ 同上，非主线选项。',why_for_you:['第三脑机接口玩家','⚠️ 非你主线方向'],current_match:'6.0',future_match:'5.5',pos:[{dept:'脑机接口研发',jobs:['嵌入式（需从零学脑电）']}],adv:['前沿赛道'],risk:['初创+非主线'],source_url:'https://www.stairmed.com',source:'36氪',c_pay:'🟠',c_tech:'🟠',c_wlb:'🟠'},
  {id:32,name:'特斯拉',en:'Tesla',cat:'auto',subcat:'外资新能源',dist:'临港',commute_jd:3,commute_mh:2,cash_low:36,cash_high:50,cash_mid:43,fund_pct:12,fund_total:13.5,stock:'RSU',total5y:265,wlb_hours:48,pay:8.0,tech_now:7.5,tech_future:6.0,geo:7.0,career:8.5,wlb:7.0,endow:8.5,industry:8.0,cohort:3,housing:7,poct:1,sweat:3,ai_ivd:5,energy:5,afm_boost:false,intern_path:null,intro:'全球电动车标杆。',why_for_you:['品牌光环','RSU 长期价值'],current_match:'7.5',future_match:'6.0',pos:[{dept:'动力能源',jobs:['BMS 嵌入式']}],adv:['品牌 + RSU'],risk:['WLB 一般'],source_url:'https://www.tesla.com/careers',source:'官网',c_pay:'🟡',c_tech:'🟡',c_wlb:'🟡'},
  {id:33,name:'字节健康',en:'ByteDance Health',cat:'aiot',subcat:'互联网+健康',dist:'徐汇',commute_jd:3,commute_mh:3,cash_low:38,cash_high:52,cash_mid:45,fund_pct:12,fund_total:13.5,stock:'期权',total5y:275,wlb_hours:55,pay:8.5,tech_now:7.5,tech_future:7.0,geo:7.5,career:8.5,wlb:5.5,endow:8.0,industry:8.0,cohort:6,housing:6,poct:5,sweat:6,ai_ivd:8,energy:5,afm_boost:false,intern_path:null,intro:'字节健康事业部。',why_for_you:['薪资高'],current_match:'7.5',future_match:'7.0',pos:[{dept:'智能硬件',jobs:['健康穿戴嵌入式']}],adv:['薪资高'],risk:['WLB 55h'],source_url:'https://jobs.bytedance.com',source:'官方',c_pay:'🟡',c_tech:'🟡',c_wlb:'🟢'},
  {id:34,name:'博世',en:'Bosch',cat:'auto',subcat:'外资 Tier 1',dist:'徐汇',commute_jd:3,commute_mh:3,cash_low:26,cash_high:34,cash_mid:30,fund_pct:12,fund_total:13.5,stock:'none',total5y:190,wlb_hours:40,pay:6.2,tech_now:7.5,tech_future:6.5,geo:7.5,career:7.5,wlb:9.5,endow:7.5,industry:7.5,cohort:3,housing:7,poct:2,sweat:3,ai_ivd:5,energy:5,afm_boost:false,intern_path:null,intro:'全球 Tier 1 巨头。',why_for_you:['WLB 顶级'],current_match:'7.5',future_match:'6.5',pos:[{dept:'底盘控制',jobs:['ESP/ABS']}],adv:['WLB 顶级'],risk:['晋升窄'],source_url:'https://www.bosch.com.cn',source:'官网',c_pay:'🟡',c_tech:'🟡',c_wlb:'🟢'},
  {id:35,name:'大疆创新',en:'DJI',cat:'aiot',subcat:'无人机',dist:'徐汇',commute_jd:3,commute_mh:3,cash_low:32,cash_high:48,cash_mid:40,fund_pct:10,fund_total:10.5,stock:'虚拟股权',total5y:250,wlb_hours:50,pay:7.8,tech_now:7.5,tech_future:6.0,geo:7.0,career:8.5,wlb:6.5,endow:8.5,industry:8.0,cohort:3,housing:6,poct:1,sweat:3,ai_ivd:6,energy:5,afm_boost:false,intern_path:null,intro:'全球无人机龙头。',why_for_you:['RTOS 天花板','简历加分'],current_match:'7.5',future_match:'6.0',pos:[{dept:'飞控',jobs:['飞控嵌入式']}],adv:['技术深度'],risk:['WLB 偏低'],source_url:'https://we.dji.com',source:'官网',c_pay:'🟡',c_tech:'🟡',c_wlb:'🟡'},
  {id:36,name:'宇构智核',en:'Yugou Core',cat:'startup',subcat:'脑机接口早期 · 规模过小',dist:'浦东新区',commute_jd:3,commute_mh:3,cash_low:22,cash_high:32,cash_mid:27,fund_pct:6,fund_total:6.0,stock:'期权（流动性差）',total5y:160,wlb_hours:48,pay:5.3,tech_now:7.5,tech_future:6.5,geo:6.5,career:5.5,wlb:7.0,endow:6.5,industry:7.5,cohort:5,housing:4,poct:3,sweat:5,ai_ivd:7,energy:5,afm_boost:false,intern_path:null,intern_boost:0,honest_feedback:'你的亲身实习反馈：公司太小，薪资与未来前景都无竞争力',intro:'⚠️ 你在这里实习过（2025.12-2026.2），**亲身感受：公司规模过小，薪资和未来前景都没有竞争力**。脑机接口初创赛道本身有价值，但作为就业选项不推荐。',why_for_you:['⚠️ 亲身反馈：公司太小不推荐','脑机接口赛道价值可通过脑虎/博睿康实现','这段实习更适合写在简历里，不适合转正'],current_match:'7.5',future_match:'6.5',pos:[{dept:'脑机接口项目部',jobs:['嵌入式全栈（不推荐转正）']}],adv:['简历已有经历'],risk:['⚠️ 用户亲述：规模小+薪资差+前景弱','初创风险极高','期权流动性差'],source_url:'-',source:'🟢 你亲自实习反馈',c_pay:'🟢',c_tech:'🟡',c_wlb:'🟠'},
  {id:37,name:'寒武纪',en:'Cambricon',ticker:'688256.SH',cat:'aiot',subcat:'AI 芯片',dist:'浦东新区',commute_jd:3,commute_mh:3,cash_low:35,cash_high:50,cash_mid:42.5,fund_pct:10,fund_total:10.5,stock:'限制性股票',total5y:260,wlb_hours:50,pay:8.0,tech_now:8.0,tech_future:6.5,geo:7.0,career:8.5,wlb:6.5,endow:8.5,industry:8.5,cohort:3,housing:6,poct:2,sweat:3,ai_ivd:8,energy:4,afm_boost:false,intern_path:null,intro:'AI 芯片第一股。',why_for_you:['AI 芯片独角兽'],current_match:'8.0',future_match:'6.5',pos:[{dept:'嵌入式平台部',jobs:['AI 芯片嵌入式']}],adv:['AI 龙头'],risk:['业绩波动'],source_url:'https://www.cambricon.com',source:'官网',c_pay:'🟠',c_tech:'🟠',c_wlb:'🟠'},
  {id:38,name:'黑芝麻智能',en:'Black Sesame',cat:'auto',subcat:'自动驾驶芯片',dist:'浦东新区',commute_jd:3,commute_mh:3,cash_low:32,cash_high:46,cash_mid:39,fund_pct:10,fund_total:10.5,stock:'港股期权',total5y:240,wlb_hours:48,pay:7.3,tech_now:8.2,tech_future:6.5,geo:7.0,career:8.0,wlb:7.0,endow:8.0,industry:8.0,cohort:3,housing:6,poct:2,sweat:3,ai_ivd:7,energy:5,afm_boost:false,intern_path:null,intro:'车规级 AI 芯片独角兽。',why_for_you:['港股上市期权'],current_match:'8.2',future_match:'6.5',pos:[{dept:'芯片系统',jobs:['SoC 嵌入式']}],adv:['AI 芯片头部'],risk:['股价波动'],source_url:'https://www.blacksesametech.com',source:'港交所',c_pay:'🟠',c_tech:'🟡',c_wlb:'🟠'},
  {id:39,name:'华域汽车',en:'HASCO',cat:'auto',subcat:'上汽 Tier 1',dist:'浦东新区',commute_jd:3,commute_mh:3,cash_low:26,cash_high:36,cash_mid:31,fund_pct:12,fund_total:13.5,stock:'少量',total5y:195,wlb_hours:42,pay:6.5,tech_now:7.2,tech_future:5.5,geo:7.5,career:7.5,wlb:9.0,endow:7.0,industry:7.0,cohort:2,housing:7,poct:1,sweat:2,ai_ivd:4,energy:4,afm_boost:false,intern_path:null,intro:'上汽集团核心零部件。',why_for_you:['公积金顶格','WLB 极佳'],current_match:'7.2',future_match:'5.5',pos:[{dept:'电子系统',jobs:['车载嵌入式']}],adv:['公积金 12+12'],risk:['偏传统'],source_url:'https://www.hasco.com.cn',source:'官网',c_pay:'🟠',c_tech:'🟠',c_wlb:'🟡'},
  {id:40,name:'恩智浦',en:'NXP',cat:'auto',subcat:'外企汽车芯片',dist:'徐汇',commute_jd:3,commute_mh:3,cash_low:30,cash_high:42,cash_mid:36,fund_pct:12,fund_total:13.5,stock:'RSU',total5y:225,wlb_hours:42,pay:7.3,tech_now:8.0,tech_future:6.5,geo:7.5,career:7.8,wlb:9.5,endow:8.0,industry:8.0,cohort:3,housing:7,poct:1,sweat:2,ai_ivd:5,energy:5,afm_boost:false,intern_path:null,intro:'汽车芯片全球龙头。',why_for_you:['汽车芯片','WLB 顶级'],current_match:'8.0',future_match:'6.5',pos:[{dept:'汽车 MCU',jobs:['汽车芯片嵌入式']}],adv:['WLB 顶级'],risk:['外企天花板'],source_url:'https://www.nxp.com/careers',source:'官网',c_pay:'🟠',c_tech:'🟡',c_wlb:'🟠'},

  // ═══ 剩余 20 家 (41-60) · 最简数据 ═══
  {id:41,name:'上海人工智能实验室',en:'Shanghai AI Lab',cat:'soe',subcat:'国家实验室',tag:'⭐隐藏福地',dist:'徐汇',commute_jd:3,commute_mh:3,cash_low:32,cash_high:50,cash_mid:41,fund_pct:12,fund_total:13.5,stock:'none',housing_bonus:'人才公寓',total5y:255,wlb_hours:45,pay:7.8,tech_now:8.0,tech_future:7.5,geo:8.5,career:9.0,wlb:8.5,endow:9.5,industry:9.8,cohort:5,housing:7,poct:4,sweat:5,ai_ivd:8,energy:5,afm_boost:true,intern_path:null,intro:'国家级AI顶层机构。',why_for_you:['国家级平台','人才公寓','AFM 加分'],current_match:'8.0',future_match:'7.5',pos:[{dept:'具身智能组',jobs:['嵌入式AI部署']}],adv:['国家级平台'],risk:['嵌入式岗少'],source_url:'https://www.shlab.org.cn',source:'官网',c_pay:'🟡',c_tech:'🟠',c_wlb:'🟠'},
  {id:42,name:'中山医院 · 工程科',en:'Zhongshan BME',cat:'hospital',subcat:'复旦系三甲',tag:'⭐隐藏福地',dist:'徐汇',commute_jd:3,commute_mh:3,cash_low:18,cash_high:26,cash_mid:22,fund_pct:12,fund_total:13.5,stock:'none',housing_bonus:'医院公寓',total5y:160,wlb_hours:40,pay:4.3,tech_now:7.5,tech_future:8.5,geo:8.5,career:8.5,wlb:9.5,endow:8.8,industry:8.5,cohort:8.5,housing:5,poct:8,sweat:6,ai_ivd:6,energy:5,afm_boost:true,intern_path:null,intro:'复旦附属中山医院工程科。',why_for_you:['事业编','AFM 变现'],current_match:'7.5',future_match:'8.5',pos:[{dept:'工程科',jobs:['临床工程师']}],adv:['事业编'],risk:['非交大系'],source_url:'https://www.zs-hospital.sh.cn',source:'医院',c_pay:'🟠',c_tech:'🟠',c_wlb:'🟡'},
  {id:43,name:'华山医院 · 工程科',en:'Huashan BME',cat:'hospital',subcat:'复旦系三甲',tag:'⭐隐藏福地',dist:'静安',commute_jd:3,commute_mh:3,cash_low:18,cash_high:26,cash_mid:22,fund_pct:12,fund_total:13.5,stock:'none',total5y:160,wlb_hours:40,pay:4.3,tech_now:7.3,tech_future:8.3,geo:8.3,career:8.3,wlb:9.5,endow:8.5,industry:8.5,cohort:8.0,housing:5,poct:8,sweat:6,ai_ivd:6,energy:5,afm_boost:true,intern_path:null,intro:'复旦附属华山医院工程科。',why_for_you:['三甲事业编'],current_match:'7.3',future_match:'8.3',pos:[{dept:'工程科',jobs:['临床工程师']}],adv:['事业编'],risk:['薪资低'],source_url:'https://www.huashan.org.cn',source:'医院',c_pay:'🟠',c_tech:'🟠',c_wlb:'🟡'},
  {id:44,name:'腾讯 AIoT',en:'Tencent AIoT',cat:'aiot',subcat:'互联网+IoT',dist:'徐汇',commute_jd:3,commute_mh:3,cash_low:35,cash_high:48,cash_mid:41.5,fund_pct:12,fund_total:13.5,stock:'RSU',total5y:255,wlb_hours:50,pay:7.8,tech_now:6.5,tech_future:6.0,geo:7.5,career:8.0,wlb:6.5,endow:8.0,industry:7.5,cohort:4,housing:6,poct:3,sweat:3,ai_ivd:6,energy:4,afm_boost:false,intern_path:null,intro:'腾讯 AIoT。',why_for_you:['品牌光环'],current_match:'6.5',future_match:'6.0',pos:[{dept:'IoT 终端',jobs:['嵌入式']}],adv:['品牌'],risk:['非核心'],source_url:'https://careers.tencent.com',source:'官网',c_pay:'🟡',c_tech:'🟠',c_wlb:'🟠'},
  {id:45,name:'字节 AIoT',en:'ByteDance AIoT',cat:'aiot',subcat:'互联网+IoT',dist:'徐汇',commute_jd:3,commute_mh:3,cash_low:38,cash_high:52,cash_mid:45,fund_pct:12,fund_total:13.5,stock:'期权',total5y:275,wlb_hours:58,pay:8.3,tech_now:6.5,tech_future:5.5,geo:7.5,career:8.0,wlb:5.0,endow:7.5,industry:7.5,cohort:3,housing:6,poct:2,sweat:3,ai_ivd:5,energy:3,afm_boost:false,intern_path:null,intro:'字节 AIoT。',why_for_you:['薪资高'],current_match:'6.5',future_match:'5.5',pos:[{dept:'IoT 设备',jobs:['嵌入式']}],adv:['薪资高'],risk:['WLB 58h'],source_url:'https://jobs.bytedance.com',source:'官方',c_pay:'🟠',c_tech:'🟡',c_wlb:'🟡'},
  {id:46,name:'小米 AIoT',en:'Xiaomi AIoT',cat:'aiot',subcat:'消费 AIoT',dist:'徐汇',commute_jd:3,commute_mh:3,cash_low:32,cash_high:44,cash_mid:38,fund_pct:12,fund_total:13.5,stock:'港股期权',total5y:240,wlb_hours:50,pay:7.5,tech_now:6.5,tech_future:5.5,geo:8.0,career:7.5,wlb:6.5,endow:7.5,industry:7.5,cohort:3,housing:7,poct:2,sweat:3,ai_ivd:5,energy:4,afm_boost:false,intern_path:null,intro:'小米 AIoT 生态。',why_for_you:['生态大'],current_match:'6.5',future_match:'5.5',pos:[{dept:'IoT 模组',jobs:['WiFi/BLE']}],adv:['公积金顶格'],risk:['偏消费'],source_url:'https://hr.xiaomi.com',source:'🟢 知乎 26 届',c_pay:'🟢',c_tech:'🟡',c_wlb:'🟡'},
  {id:47,name:'商汤科技',en:'SenseTime',cat:'startup',subcat:'AI 视觉',dist:'徐汇',commute_jd:3,commute_mh:3,cash_low:28,cash_high:40,cash_mid:34,fund_pct:10,fund_total:10.5,stock:'港股期权',total5y:210,wlb_hours:48,pay:6.8,tech_now:6.5,tech_future:5.5,geo:7.0,career:7.5,wlb:7.0,endow:7.5,industry:7.0,cohort:3,housing:6,poct:1,sweat:2,ai_ivd:5,energy:3,afm_boost:false,intern_path:null,intro:'AI 视觉。',why_for_you:['AI 视觉头部'],current_match:'6.5',future_match:'5.5',pos:[{dept:'边缘AI',jobs:['AI 部署']}],adv:['AI 技术'],risk:['亏损'],source_url:'https://www.sensetime.com',source:'官网',c_pay:'🟠',c_tech:'🟠',c_wlb:'🟠'},
  {id:48,name:'乐普医疗',en:'Lepu Medical',cat:'medical',subcat:'心血管医疗',dist:'浦东新区',commute_jd:3,commute_mh:3,cash_low:25,cash_high:35,cash_mid:30,fund_pct:8,fund_total:8.8,stock:'期权',total5y:185,wlb_hours:44,pay:6.3,tech_now:7.5,tech_future:7.5,geo:7.0,career:7.0,wlb:8.0,endow:7.0,industry:7.5,cohort:6,housing:6,poct:6,sweat:4,ai_ivd:5,energy:4,afm_boost:false,intern_path:null,intro:'心血管医疗器械龙头。',why_for_you:['心电延伸'],current_match:'7.5',future_match:'7.5',pos:[{dept:'电生理',jobs:['心电嵌入式']}],adv:['心血管细分'],risk:['薪资中等'],source_url:'https://www.lepu.cn',source:'官网',c_pay:'🟠',c_tech:'🟠',c_wlb:'🟡'},
  {id:49,name:'德赛西威',en:'Desay SV',cat:'auto',subcat:'国内 Tier 1',dist:'浦东新区',commute_jd:3,commute_mh:3,cash_low:28,cash_high:36,cash_mid:32,fund_pct:8,fund_total:8.8,stock:'期权',total5y:195,wlb_hours:46,pay:6.5,tech_now:7.0,tech_future:5.5,geo:7.0,career:7.5,wlb:7.5,endow:7.0,industry:7.5,cohort:3,housing:6,poct:1,sweat:2,ai_ivd:5,energy:3,afm_boost:false,intern_path:null,intro:'国内 Tier 1。',why_for_you:['嵌入式成长'],current_match:'7.0',future_match:'5.5',pos:[{dept:'智能座舱',jobs:['座舱域控']}],adv:['技术成长'],risk:['公积金中等'],source_url:'https://www.desaysv.com',source:'官网',c_pay:'🟠',c_tech:'🟠',c_wlb:'🟠'},
  {id:50,name:'上海电气中央研究院',en:'SEC Central R&D',cat:'soe',subcat:'国企工业',dist:'浦东新区',commute_jd:3,commute_mh:3,cash_low:22,cash_high:30,cash_mid:26,fund_pct:12,fund_total:13.5,stock:'none',housing_bonus:'人才公寓',total5y:185,wlb_hours:42,pay:5.5,tech_now:5.5,tech_future:5,geo:9.0,career:7.2,wlb:9.0,endow:7.5,industry:7.0,cohort:2,housing:9,poct:1,sweat:2,ai_ivd:4,energy:4,afm_boost:false,intern_path:null,intro:'上海国资装备。',why_for_you:['上海国资','公积金顶格'],current_match:'5.5',future_match:'5',pos:[{dept:'智能制造',jobs:['工业嵌入式']}],adv:['上海国资'],risk:['薪资低'],source_url:'https://www.shanghai-electric.com',source:'官网',c_pay:'🟠',c_tech:'🟠',c_wlb:'🟠'},
  {id:51,name:'宁德时代上海',en:'CATL Shanghai',cat:'auto',subcat:'新能源电池',dist:'浦东新区',commute_jd:3,commute_mh:3,cash_low:28,cash_high:38,cash_mid:33,fund_pct:7,fund_total:7.7,stock:'限制性股票',total5y:200,wlb_hours:50,pay:6.8,tech_now:6.5,tech_future:5.5,geo:7.0,career:8.5,wlb:6.5,endow:8.0,industry:8.5,cohort:3,housing:6,poct:1,sweat:2,ai_ivd:5,energy:6,afm_boost:false,intern_path:null,intro:'动力电池龙头。',why_for_you:['新能源龙头'],current_match:'6.5',future_match:'5.5',pos:[{dept:'BMS',jobs:['BMS 嵌入式']}],adv:['新能源'],risk:['非医疗'],source_url:'https://careers.catl.com',source:'官网',c_pay:'🟡',c_tech:'🟡',c_wlb:'🟡'},
  {id:52,name:'中电科 21 所',en:'CETC 21st',cat:'soe',subcat:'央企研究所',dist:'浦东新区',commute_jd:3,commute_mh:3,cash_low:23,cash_high:31,cash_mid:27,fund_pct:12,fund_total:13.5,stock:'none',housing_bonus:'人才公寓',total5y:195,wlb_hours:44,pay:6.0,tech_now:6.0,tech_future:5,geo:9.0,career:7.5,wlb:9.0,endow:8.0,industry:7.5,cohort:2,housing:9,poct:1,sweat:2,ai_ivd:4,energy:5,afm_boost:false,intern_path:null,intro:'微特电机所。',why_for_you:['央企稳定','公积金顶格'],current_match:'6.0',future_match:'5',pos:[{dept:'电机驱动',jobs:['电机控制']}],adv:['央企','公积金顶格'],risk:['薪资低'],source_url:'https://www.21icresearch.com',source:'招聘',c_pay:'🟠',c_tech:'🟠',c_wlb:'🟠'},
  {id:53,name:'中电科 23 所',en:'CETC 23rd',cat:'soe',subcat:'央企研究所',dist:'浦东新区',commute_jd:3,commute_mh:3,cash_low:22,cash_high:30,cash_mid:26,fund_pct:12,fund_total:13.5,stock:'none',housing_bonus:'人才公寓',total5y:185,wlb_hours:44,pay:5.5,tech_now:6.0,tech_future:5,geo:9.0,career:7.5,wlb:9.0,endow:7.8,industry:7.5,cohort:2,housing:9,poct:1,sweat:2,ai_ivd:4,energy:5,afm_boost:false,intern_path:null,intro:'特种传输线缆所。',why_for_you:['央企稳定','光纤传感对口'],current_match:'6.0',future_match:'5',pos:[{dept:'光纤传感',jobs:['光纤嵌入式']}],adv:['央国企','光纤传感'],risk:['薪资最低'],source_url:'https://www.cetc23.com',source:'招聘',c_pay:'🟠',c_tech:'🟠',c_wlb:'🟠'},
  {id:54,name:'中船 708 所',en:'MARIC 708th',cat:'soe',subcat:'央企军工',dist:'浦东新区',commute_jd:3,commute_mh:3,cash_low:24,cash_high:32,cash_mid:28,fund_pct:12,fund_total:13.5,stock:'none',housing_bonus:'人才公寓',total5y:195,wlb_hours:44,pay:6.0,tech_now:5.5,tech_future:4.5,geo:9.0,career:7.8,wlb:8.8,endow:8.0,industry:7.5,cohort:2,housing:9,poct:1,sweat:2,ai_ivd:4,energy:4,afm_boost:false,intern_path:null,intro:'中船 708 船舶总体设计所。',why_for_you:['央企军工'],current_match:'5.5',future_match:'4.5',pos:[{dept:'船舶电子',jobs:['船用嵌入式']}],adv:['央企军工'],risk:['方向弱相关'],source_url:'https://www.maric.com.cn',source:'招聘',c_pay:'🟠',c_tech:'🟠',c_wlb:'🟠'},
  {id:55,name:'中科院上海技物所',en:'SITP, CAS',cat:'soe',subcat:'国家研究所',tag:'⭐隐藏福地',dist:'虹口',commute_jd:2,commute_mh:2,cash_low:22,cash_high:28,cash_mid:25,fund_pct:12,fund_total:13.5,stock:'none',housing_bonus:'安家补贴',total5y:180,wlb_hours:45,pay:5.3,tech_now:7.5,tech_future:6.5,geo:7.5,career:8.0,wlb:8.5,endow:8.5,industry:8.0,cohort:4,housing:6,poct:3,sweat:3,ai_ivd:5,energy:5,afm_boost:true,intern_path:null,intro:'中科院红外+光电探测国家队。',why_for_you:['国家研究所'],current_match:'7.5',future_match:'6.5',pos:[{dept:'红外光电',jobs:['光电探测嵌入式']}],adv:['国家所','事业编'],risk:['方向关联弱'],source_url:'http://www.sitp.cas.cn',source:'中科院',c_pay:'🟠',c_tech:'🟠',c_wlb:'🟡'},
  {id:56,name:'阿里健康',en:'Ali Health',cat:'aiot',subcat:'互联网医疗',dist:'徐汇',commute_jd:3,commute_mh:3,cash_low:32,cash_high:42,cash_mid:37,fund_pct:12,fund_total:13.5,stock:'港股期权',total5y:230,wlb_hours:48,pay:7.2,tech_now:6.5,tech_future:5.5,geo:7.0,career:7.5,wlb:7.0,endow:7.5,industry:7.5,cohort:4,housing:6,poct:3,sweat:3,ai_ivd:6,energy:3,afm_boost:false,intern_path:null,intro:'阿里大健康旗舰。',why_for_you:['公积金顶格'],current_match:'6.5',future_match:'5.5',pos:[{dept:'智慧医疗',jobs:['医疗 IoT']}],adv:['公积金顶格'],risk:['偏平台'],source_url:'https://www.alihealth.cn',source:'官网',c_pay:'🟠',c_tech:'🟠',c_wlb:'🟠'},
  {id:57,name:'石头科技',en:'Roborock',cat:'aiot',subcat:'消费机器人',dist:'浦东新区',commute_jd:3,commute_mh:3,cash_low:28,cash_high:38,cash_mid:33,fund_pct:8,fund_total:8.8,stock:'期权',total5y:200,wlb_hours:46,pay:6.8,tech_now:6.0,tech_future:5,geo:7.5,career:7.5,wlb:7.5,endow:7.5,industry:7.5,cohort:2,housing:7,poct:1,sweat:2,ai_ivd:5,energy:3,afm_boost:false,intern_path:null,intro:'扫地机器人龙头。',why_for_you:['WLB 好'],current_match:'6.0',future_match:'5',pos:[{dept:'机器人控制',jobs:['嵌入式']}],adv:['WLB 好'],risk:['非医疗'],source_url:'https://www.roborock.com',source:'官网',c_pay:'🟠',c_tech:'🟠',c_wlb:'🟠'},
  {id:58,name:'京东健康',en:'JD Health',cat:'aiot',subcat:'互联网医疗',dist:'徐汇',commute_jd:3,commute_mh:3,cash_low:30,cash_high:40,cash_mid:35,fund_pct:10,fund_total:10.5,stock:'港股期权',total5y:215,wlb_hours:48,pay:7.0,tech_now:6.2,tech_future:5,geo:7.0,career:7.0,wlb:7.0,endow:7.0,industry:7.0,cohort:3,housing:6,poct:2,sweat:3,ai_ivd:5,energy:3,afm_boost:false,intern_path:null,intro:'京东大健康。',why_for_you:['薪资 OK'],current_match:'6.2',future_match:'5',pos:[{dept:'健康硬件',jobs:['IoT']}],adv:['薪资 OK'],risk:['偏平台'],source_url:'https://jobs.jd.com',source:'招聘',c_pay:'🟠',c_tech:'🟠',c_wlb:'🟠'},
  {id:59,name:'德州仪器',en:'Texas Instruments',cat:'aiot',subcat:'外企模拟芯片',dist:'浦东新区',commute_jd:3,commute_mh:3,cash_low:28,cash_high:38,cash_mid:33,fund_pct:12,fund_total:13.5,stock:'RSU',total5y:210,wlb_hours:40,pay:7.0,tech_now:7.5,tech_future:6,geo:7.5,career:7.5,wlb:9.8,endow:7.8,industry:7.5,cohort:2,housing:7,poct:1,sweat:2,ai_ivd:5,energy:5,afm_boost:false,intern_path:null,intro:'全球模拟芯片龙头。',why_for_you:['WLB 顶级'],current_match:'7.5',future_match:'6',pos:[{dept:'工业应用',jobs:['嵌入式']}],adv:['WLB 顶级'],risk:['外企'],source_url:'https://careers.ti.com',source:'官网',c_pay:'🟠',c_tech:'🟠',c_wlb:'🟡'},
  {id:60,name:'安波福',en:'Aptiv',cat:'auto',subcat:'外资 Tier 1',dist:'浦东新区',commute_jd:3,commute_mh:3,cash_low:26,cash_high:34,cash_mid:30,fund_pct:12,fund_total:13.5,stock:'RSU',total5y:190,wlb_hours:42,pay:6.3,tech_now:7.2,tech_future:5.5,geo:7.5,career:7.5,wlb:9.0,endow:7.5,industry:7.5,cohort:2,housing:7,poct:1,sweat:2,ai_ivd:5,energy:4,afm_boost:false,intern_path:null,intro:'全球汽车 Tier 1。',why_for_you:['WLB 好'],current_match:'7.2',future_match:'5.5',pos:[{dept:'ADAS',jobs:['域控制器']}],adv:['WLB 好'],risk:['薪资偏低'],source_url:'https://www.aptiv.com/careers',source:'官网',c_pay:'🟠',c_tech:'🟡',c_wlb:'🟠'}
];

const CATEGORIES_V4 = {
  medical: {name:'医疗电子·可穿戴医疗', color:'#8b0a1e', icon:'⚕︎'},
  auto:    {name:'汽车电子',           color:'#1a3a5c', icon:'⚙'},
  aiot:    {name:'AIoT·消费电子',      color:'#b08d3f', icon:'◈'},
  soe:     {name:'央国企·研究所',       color:'#5f6b7a', icon:'⚐'},
  hospital:{name:'医院工程科',          color:'#5f7a5f', icon:'✚'},
  startup: {name:'独角兽·前沿初创',     color:'#a63d2a', icon:'◆'}
};

/* 综合总分（含 AFM 加分 + 实习通道加分）*/
function computeTotalScore(c, weights) {
  const W = weights || WEIGHTS_V4;
  let base = (
    c.pay * W.pay + c.tech_now * W.tech_now + c.tech_future * W.tech_future +
    c.geo * W.geo + c.career * W.career + c.wlb * W.wlb +
    c.endow * W.endow + c.industry * W.industry +
    c.cohort * W.cohort + c.housing * W.housing
  );
  // AFM 加分（仅对研究型岗位显著）
  if (c.afm_boost && (c.cat === 'medical' || c.cat === 'soe' || c.cat === 'hospital')) {
    base += 0.15;
  }
  // 实习通道加分（基于真实价值，不是机械套公式）
  // current_off_topic: 实习在这但跨方向（小米汽车） -> 小加分
  // current: 实习延续主线（无）
  // adjacent: 同赛道头部（脑虎博睿康） -> 中加分
  if (c.intern_path === 'current_off_topic') base += c.intern_boost || 0.5;
  else if (c.intern_path === 'current') base += c.intern_boost || 1.5;
  else if (c.intern_path === 'adjacent') base += (c.intern_boost || 0.8);
  return base;
}

function recomputeTiers(weights) {
  COMPANIES_V4.forEach(c => { c.score = computeTotalScore(c, weights); });
  const sorted = [...COMPANIES_V4].sort((a,b)=>b.score-a.score);
  sorted.forEach((c,i) => {
    const pct = i / sorted.length;
    if (pct < 0.07)      c.tier = 'SSS';
    else if (pct < 0.22) c.tier = 'SS';
    else if (pct < 0.48) c.tier = 'S';
    else if (pct < 0.75) c.tier = 'A';
    else                 c.tier = 'B';
    c.rank = i + 1;
  });
}

recomputeTiers();
