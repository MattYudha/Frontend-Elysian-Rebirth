import type { TranslationKeys } from './en';

export const translationsZH: TranslationKeys = {
    common: {
        loading: '加载中...',
        save: '保存',
        cancel: '取消',
        delete: '删除',
        edit: '编辑',
        close: '关闭',
        search: '搜索',
        filter: '筛选',
        export: '导出',
        import: '导入',
    },
    nav: {
        dashboard: '仪表板',
        chat: '聊天',
        knowledge: '知识库',
        editor: '文档编辑器',
        settings: '设置',
        logout: '登出',
        product: '产品',
        solutions: '解决方案',
        enterprise: '企业',
        pricing: '价格',
        login: '登录',
        getStarted: '开始使用',
        toggleTerminal: '切换终端',
        toggleTheme: '切换主题',
    },
    auth: {
        loginTitle: '登录',
        loginSubtitle: '登录以继续',
        email: '邮箱',
        password: '密码',
        login: '登录',
        logout: '登出',
        demoHint: '演示：使用任何邮箱/密码登录',
        loginSuccess: '登录成功！',
        loginFailed: '登录失败，请重试。',
        accessDenied: '访问被拒绝',
        noPermission: '您没有权限访问此页面。',
    },
    dashboard: {
        title: 'AI 控制中心',
        subtitle: '企业网格',
        breadcrumb: '仪表板',
        heading: '仪表板',
        description: '监控令牌使用情况和管道状态。',
        documents: '文档',
        apiCalls: 'LLM 令牌',
        errorRate: '错误率',
        knowledgeHealth: '知识健康度',
        activePipelines: '活动管道',
        vectorIndexSync: '向量索引同步',
        docsIndexed: '已索引文档',
        success: '成功',
        fromLastMonth: '较上月',
        fromLastWeek: '较上周',
        withinLimits: '在限制范围内',
        solidPerformance: '表现稳定',
    },
    chat: {
        title: 'AI 聊天',
        subtitle: '与企业AI对话',
        placeholder: '输入您的消息...',
        send: '发送',
    },
    knowledge: {
        title: '知识库',
        subtitle: 'RAG 配置与管理',
        chunkingStrategy: '分块策略',
        chunkSize: '块大小',
        overlap: '重叠',
        embeddingModel: '嵌入模型',
        sources: '知识源',
        searchPlayground: '搜索实验区',
        uploadDocument: '上传文档',
    },
    editor: {
        title: '文档编辑器',
        subtitle: '人机协同编辑',
        save: '保存',
        export: '导出',
        aiActions: 'AI 操作',
        rewrite: '重写',
        summarize: '总结',
        translate: '翻译',
    },
    settings: {
        title: '设置',
        subtitle: '应用程序配置',
        appearance: '外观',
        darkMode: '深色模式',
        language: '语言',
        languageRegion: '语言与地区',
        features: '功能',
        advancedMode: '高级模式',
        telemetry: '启用遥测',
        saveSettings: '保存设置',
    },
    landingNav: {
        products: {
            title: '产品',
        },
        solutions: {
            title: '解决方案',
        },
        useCases: {
            title: '应用场景',
        },
        faq: {
            title: '常见问题',
        },
        actions: {
            startFree: '免费开始',
            search: '搜索',
            microCopy: '只需30秒。'
        }
    },
    landing: {
        hero: {
            badge: 'Elysian v2.0 公测版',
            title1: '产品管理',
            title2: '的新标准',
            description: '现代团队的智能操作系统。将路线图、文档和 AI 和谐结合。',
            ctaStart: '开始使用',
            ctaDemo: '查看演示',
            proof: '无需信用卡 • 专为印尼中小企业打造',
        },
        marquee: ['零售', '物流', '代理机构', '医疗', '餐饮', '制造业', '咨询', '房地产'],
        showcase: {
            badge: 'Elysian 的力量',
            title1: '一个平台。',
            title2: '三大核心优势。',
            description: '将自动化、智能文档处理和 AI 助手结合在一个无缝的生态系统中。',
            cards: {
                dev: { title: '开发者集成', desc: '在幕后为您的业务工作的先进技术。' },
                docs: { title: '文档分析 (RAG)', desc: '在幕后为您的业务工作的先进技术。' },
                insights: { title: '商业洞察', desc: '在幕后为您的业务工作的先进技术。' }
            }
        },
        deepDive: {
            badge: '深入了解',
            title1: '项目管理',
            title2: '无障碍。',
            description: 'Elysian 提供从创意到执行的全面可视化。',
            cards: {
                cycles: { title: '自动周期', desc: "通过直观的图表自动跟踪团队的冲刺进度。" },
                inbox: { title: '智能收件箱', desc: '快速审核、批准或拒绝收到的请求。' },
                insights: { title: 'Elysian 洞察', desc: '利用 AI 驱动的数据分析预测瓶颈并优化团队绩效。', action: '查看报告' }
            }
        },
        integration: {
            badge: '生态系统',
            title1: '连接',
            title2: '您最喜欢的工具。',
            description: 'Elysian 与数百个应用程序集成，保持您团队的工作流程顺畅。',
            hint: '滑动查看更多',
            items: {
                slack: { title: 'Slack 通知', desc: '直接在团队频道中获取实时更新。' },
                figma: { title: 'Figma 同步', desc: '将设计资产和评论直接拉入任务管理器。' },
                github: { title: 'GitHub Actions', desc: '自动部署和同步问题状态。' },
                drive: { title: 'Google Drive', desc: '无需切换标签即可访问和附加云文档。' },
                notion: { title: 'Notion 页面', desc: '嵌入内部 wiki 和知识库页面。' },
                postgres: { title: 'PostgreSQL', desc: '连接数据库进行自定义分析。' },
                gmail: { title: 'Gmail 插件', desc: '一键将电子邮件转换为任务或支持工单。' },
                cta: '了解更多'
            }
        },
        agents: {
            badge: 'Elysian 神经网络',
            title1: '将任务委派给',
            title2: '专业 AI 代理。',
            description: '为每项工作选择合适的代理。从数据分析师到安全审计员，随时待命。',
            demo: {
                assign: '分配给...',
                processing: '处理上下文...',
                available: '4 个代理可用'
            },
            items: {
                analyst: { name: '数据分析 AI', role: '财务洞察' },
                editor: { name: '内容编辑', role: 'SEO & 文案与写作' },
                compliance: { name: '合规机器', role: '法律与审计' },
                coder: { name: '开发助手', role: '代码审查' }
            }
        },
        terminal: {
            logs: {
                system: '正在启动 Elysian 平台... (IAM | MDM | Compliance)',
                scan: '正在验证安全模块和工作流编排...',
                ready: '智能工作流编排已启用。',
                success: '系统已连接。等待操作员指令。',
                compliance: 'SOC 2 控制已验证 ✓ CC1 (实体) ✓ CC2 (通信) ✓ CC3 (风险)',
                operational: '所有系统运行正常。',
                welcome: '欢迎来到 Elysian 系统控制台。',
                help: "输入 'help' 查看命令列表，或点击上方的终端图标返回视觉模式。"
            }
        },
        problem: {
            title1: '为什么企业',
            title2: '经常陷入困境？',
            description: '许多企业主在自己的业务中沦为“员工”。时间都花在了技术问题上，而不是战略问题上。',
            items: [
                '重要文档散落在 WhatsApp 和电子邮件中',
                '由于数据不规范导致决策缓慢',
                'SOP 变成了墙上的装饰品',
                '管理日常运营导致精疲力竭'
            ],
            solutionTitle: 'Elysian 解决方案',
            solutionItems: [
                { title: '自动化 80% 的行政工作', desc: '每周节省 20+ 小时' },
                { title: '集中化知识库', desc: '一站式访问 SOP 和文档' },
                { title: '本地上下文 AI', desc: '理解您的业务语言' }
            ],
            cta: '立即转型业务'
        },
        features: {
            title: '提升业务的功能',
            subtitle: '现代业务运营的全方位平台',
            items: {
                ai: { title: '24/7 AI 助手', desc: '随时回答团队问题' },
                docs: { title: '文档中心', desc: '所有文件集中管理' },
                security: { title: '高级安全', desc: '银行级安全标准' },
                automation: { title: '工作流自动化', desc: '自动处理重复任务' }
            }
        },
        useCases: {
            title: '谁需要 Elysian？',
            subtitle: '灵活适配您业务模式的平台',
            items: {
                retail: { title: '零售与门店', items: ['自动库存检查', '智能回复客户', '产品描述生成'] },
                logistics: { title: '物流', items: ['货运跟踪', '运单汇总', '路径优化'] },
                agency: { title: '机构', items: ['即时内容灵感', '提案草稿生成', '简报分析'] },
                clinic: { title: '诊所', items: ['医疗记录汇总', '医生排班', '患者提醒'] }
            }
        },
        cta: {
            badge: '加入 AI 革命',
            title1: '准备好让您的业务',
            title2: '更轻松吗？',
            description: '加入 500+ 已转向未来工作方式的企业主。节省时间，减轻压力。',
            btnStart: '开始免费试用',
            btnConsult: '团队咨询',
            foot: '无需信用卡。随时取消。'
        },
        collaboration: {
            badge: '增强您的工作流程',
            title1: '团队协作',
            title2: '无界限。',
            description: '一个统一的平台，整合创意、执行和结果。告别孤岛，开启正确的协作方式。',
            cards: {
                project: {
                    title: '项目管理',
                    desc: '在一个直观的可视化仪表板中整合里程碑、任务和截止日期。'
                },
                updates: {
                    title: '状态更新',
                    desc: '自动化进度报告。通过异步更新节省会议时间。'
                },
                workflow: {
                    title: 'AI 工作流编排',
                    desc: '可视化设计和自动化智能 AI 代理。无限制连接逻辑路由器、推理引擎和知识库。',
                    cta: '试用工作流'
                }
            }
        },
        faq: {
            title: '常见问题',
            subtitle: '为您答疑解惑',
            q1: '我的业务数据安全吗？',
            a1: '非常安全。我们使用银行级加密（AES-256），并为每个客户提供隔离的服务环境。',
            q2: '可以与 WhatsApp 集成吗？',
            a2: '可以！Elysian 拥有官方 WhatsApp Business API 集成功能，支持自动回复和订单管理。',
            q3: '有使用培训吗？',
            a3: '我们为高级套餐提供完整的视频教程和一对一入职培训。',
            q4: '如果我想停止使用怎么办？',
            a4: '您可以随时取消订阅。您的数据可以完全导出。'
        },
        cta_section: {
            title1: '第一步',
            title2: '助力业务增长',
            description: '从中小型企业到大型企业，每个人都可以享受 Elysian 带来的业务便利。',
            btn: '立即尝试'
        },
        footer: {
            description: '印尼领先的智能运营助手，致力于帮助中小企业。我们将先进的人工智能相结合，以自动化流程、提供深刻见解并推动您的业务增长。',
            solutions: {
                title: '商业解决方案',
                items: {
                    docs: '文档自动化',
                    finance: 'AI 财务分析',
                    inventory: '库存管理',
                    trends: '市场趋势预测',
                    erp: 'ERP 集成'
                }
            },
            support: {
                title: '支持',
                items: {
                    help: '帮助中心',
                    community: '社区论坛',
                    status: '服务状态',
                    api: 'API 文档',
                    sales: '联系销售'
                }
            },
            contact: {
                title: '联系我们',
                address: 'Jl. Jend. Sudirman Kav. 52-53, South Jakarta SCBD, Indonesia'
            },
            legal: {
                privacy: '隐私政策',
                terms: '服务条款',
                accessibility: '无障碍声明',
                copyright: '© 2024 Elysian. 保留所有权利。'
            }
        },
        cookies: {
            title: '我们使用 Cookie',
            description: '我们使用 Cookie 来增强您的体验、分析流量并个性化内容。继续使用即表示您同意我们使用 Cookie。',
            accept: '接受 Cookie',
            decline: '拒绝'
        }
    }
};
