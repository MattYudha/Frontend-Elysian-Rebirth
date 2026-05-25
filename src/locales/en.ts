export const translationsEN = {
    common: {
        loading: 'Loading...',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        close: 'Close',
        search: 'Search',
        filter: 'Filter',
        export: 'Export',
        import: 'Import',
    },
    nav: {
        dashboard: 'Dashboard',
        chat: 'Chat',
        knowledge: 'Knowledge Base',
        editor: 'Document Editor',
        settings: 'Settings',
        logout: 'Logout',
        product: 'Product',
        solutions: 'Solutions',
        enterprise: 'Enterprise',
        pricing: 'Pricing',
        login: 'Login',
        getStarted: 'Get Started',
        toggleTerminal: 'Toggle Terminal',
        toggleTheme: 'Toggle Theme',
    },
    auth: {
        loginTitle: 'Sign In',
        loginSubtitle: 'Sign in to continue',
        email: 'Email',
        password: 'Password',
        login: 'Sign In',
        logout: 'Logout',
        demoHint: 'Demo: Use any email/password to sign in',
        loginSuccess: 'Login successful!',
        loginFailed: 'Login failed. Please try again.',
        accessDenied: 'Access Denied',
        noPermission: 'You do not have permission to access this page.',
    },
    dashboard: {
        title: 'AI Control Center',
        subtitle: 'Enterprise Grid',
        breadcrumb: 'Dashboard',
        heading: 'Dashboard',
        description: 'Monitor token usage and pipeline status.',
        documents: 'Documents',
        apiCalls: 'LLM Tokens',
        errorRate: 'Error Rate',
        knowledgeHealth: 'Knowledge Health',
        activePipelines: 'Active Pipelines',
        vectorIndexSync: 'Vector Index Sync',
        docsIndexed: 'Docs Indexed',
        success: 'Success',
        fromLastMonth: 'from last month',
        fromLastWeek: 'from last week',
        withinLimits: 'Within limits',
        solidPerformance: 'Solid performance',
    },
    chat: {
        title: 'AI Chat',
        subtitle: 'Conversation with Enterprise AI',
        placeholder: 'Type your message...',
        send: 'Send',
    },
    knowledge: {
        title: 'Knowledge Base',
        subtitle: 'RAG Configuration & Management',
        chunkingStrategy: 'Chunking Strategy',
        chunkSize: 'Chunk Size',
        overlap: 'Overlap',
        embeddingModel: 'Embedding Model',
        sources: 'Knowledge Sources',
        searchPlayground: 'Search Playground',
        uploadDocument: 'Upload Document',
    },
    editor: {
        title: 'Document Editor',
        subtitle: 'Human-in-the-Loop Editing',
        save: 'Save',
        export: 'Export',
        aiActions: 'AI Actions',
        rewrite: 'Rewrite',
        summarize: 'Summarize',
        translate: 'Translate',
    },
    settings: {
        title: 'Settings',
        subtitle: 'Application Configuration',
        appearance: 'Appearance',
        darkMode: 'Dark Mode',
        language: 'Language',
        languageRegion: 'Language & Region',
        features: 'Features',
        advancedMode: 'Advanced Mode',
        telemetry: 'Enable Telemetry',
        saveSettings: 'Save Settings',
    },
    landingNav: {
        products: {
            title: 'Core Features',
        },
        solutions: {
            title: 'Technology',
        },
        useCases: {
            title: 'Users',
        },
        faq: {
            title: 'FAQ',
        },
        actions: {
            startFree: 'Start Audit',
            search: 'Search',
            microCopy: 'Automated audit in seconds.'
        }
    },
    landing: {
        hero: {
            badge: 'Autonomous Financial Oversight Infrastructure',
            title1: 'Transform Pre-Audit for',
            title2: 'Regional Budgets.',
            description: 'A Multi-Agent Swarm Intelligence system to automatically detect and prevent budget markups with Immutable Audit Trail protection.',
            ctaStart: 'Start Audit Now',
            ctaDemo: 'View Demo',
            proof: 'Built for Local Governments & Inspectorates',
        },
        marquee: ['Regional Inspectorate', 'BPK', 'BPKP', 'KPK', 'Agency Head', 'Provincial Government', 'City Government', 'LKPP'],
        showcase: {
            badge: 'Power of Elysian v3.0',
            title1: 'One Infrastructure.',
            title2: 'Three Core Strengths.',
            description: 'Combining the intelligence of Swarm AI, the factual basis of RAG, and the security of Blockchain in one autonomous ecosystem.',
            cards: {
                dev: { title: 'Cognitive Swarm Engine', desc: 'MiroFish with 3 AI Agents debating each other to reach an objective audit consensus.' },
                docs: { title: 'Ground Truth & RAG', desc: 'OpenViking & Nemesis DB secure real facts from SIRUP and Regional Regulations without compromise.' },
                insights: { title: 'Immutable Trust Layer', desc: 'The track record of agent decisions is permanently locked on the Public EVM Testnet (Sepolia/Amoy).' }
            }
        },
        deepDive: {
            badge: 'Deep Dive',
            title1: 'Automated Audit',
            title2: 'Without Human Bias.',
            description: 'Elysian eliminates error-prone manual checking in the budget review process.',
            cards: {
                cycles: { title: 'Automated Price Verification', desc: 'Compare budget proposals with historical procurement data in SIRUP in seconds.' },
                inbox: { title: 'Regulation Compliance Test', desc: 'Detect procurement rule violations using high-performance RAG.' },
                insights: { title: 'Blockchain Provenance', desc: 'Ensure audit result reports cannot be manipulated with on-chain cryptographic trails.', action: 'View On-Chain Proof' }
            }
        },
        integration: {
            badge: 'Ecosystem',
            title1: 'Connected with',
            title2: 'Enterprise Architecture.',
            description: 'Elysian Rebirth v3.0 is designed to integrate with the government data ecosystem and modern infrastructure.',
            hint: 'Swipe to view ecosystem',
            items: {
                slack: { title: 'SIRUP LKPP', desc: 'Access real historical procurement data (Nemesis DB) as a baseline for price truth.' },
                figma: { title: 'SIPD Kemendagri', desc: 'Adjustment of integrated regional financial management standards.' },
                github: { title: 'Qdrant Vector DB', desc: 'Ultra-fast semantic search engine to explore hundreds of pages of Regional Regulations.' },
                drive: { title: 'MongoDB QA Gate', desc: 'Data filtering layer to ensure only valid facts are learned by AI.' },
                notion: { title: 'Sepolia Testnet', desc: 'Stores hash approval seals immutably on a public EVM network.' },
                postgres: { title: 'PostgreSQL IAM', desc: 'Solid role-based access control (RBAC) and authentication management.' },
                gmail: { title: 'Redis Pub/Sub', desc: 'Real-time streaming of debate logs between AI agents without delay.' },
                cta: 'Learn About Our Architecture'
            }
        },
        agents: {
            badge: 'Cognitive Swarm Intelligence',
            title1: 'Delegate Analysis to',
            title2: 'Our Specialist AI Agents.',
            description: 'MiroFish uses a Multi-Agent approach where each bot has its own role in dismantling the RAPBD.',
            demo: {
                assign: 'Processing Audit...',
                processing: 'Analyzing anomalies...',
                available: '3 Agents Ready to Work'
            },
            items: {
                analyst: { name: 'Auditor Agent', role: 'Price Markup Detection' },
                editor: { name: 'Compliance Agent', role: 'Legal Regulation Supervisor' },
                compliance: { name: 'Manager Agent', role: 'Decision Consensus (Manager)' },
                coder: { name: 'Blockchain Committer', role: 'Immutable Audit Seal' }
            }
        },
        terminal: {
            logs: {
                system: 'Starting Elysian Rebirth v3.0... (Swarm Engine | Nemesis DB | Trust Layer)',
                scan: 'Connecting to PostgreSQL IAM and Sepolia Testnet...',
                ready: 'MiroFish Swarm ready to receive RAPBD documents.',
                success: 'System Connected. Waiting for budget draft upload.',
                compliance: 'On-Chain Audit Trail Active ✓ OpenViking Sync ✓ MongoDB QA Gate Online',
                operational: 'All architecture layers operational.',
                welcome: 'Welcome to the Autonomous Audit Infrastructure Console.',
                help: "Type 'help' for guidance, or click the terminal icon for visual mode."
            }
        },
        problem: {
            title1: 'Why Are Budget Markups',
            title2: 'Hard to Detect?',
            description: 'The manual review process by Inspectorate auditors takes a long time, is prone to human error, and often lacks adequate historical data references instantly.',
            items: [
                'Manual verification of thousands of budget items is very slow',
                'Lack of real-time procurement comparison data',
                'Regional Price Standards (SHR) are scattered across thick PDF documents',
                'Approval track record (audit trail) is fragile and can be altered'
            ],
            solutionTitle: 'Elysian Innovation',
            solutionItems: [
                { title: 'Swarm Intelligence', desc: 'AI agents debate each other for objective decisions' },
                { title: 'Ground Truth Database', desc: 'Extracts original price references (SIRUP) without LLM manipulation' },
                { title: 'Immutable Audit Log', desc: 'Agent decision trails are permanently embedded in the Blockchain' }
            ],
            cta: 'Transform the Audit Process'
        },
        features: {
            title: 'Redefining Audit Standards',
            subtitle: 'All-in-one technology for clean government governance',
            items: {
                ai: { title: 'MiroFish Engine', desc: 'Automated consensus between AI agents' },
                docs: { title: 'OpenViking RAG', desc: 'High-precision extraction for Regional Regulations & SHR' },
                security: { title: 'Trust Layer', desc: 'On-chain recording on Sepolia' },
                automation: { title: 'Caveman Prompt', desc: 'JSON output without LLM hallucinations' }
            }
        },
        useCases: {
            title: 'Built For All Stakeholders',
            subtitle: 'From internal supervisors to the public, everyone gains transparency.',
            items: {
                retail: { title: 'Regional Inspectorate', items: ['Instant RAPBD review', 'Markup detection', 'Automatic price references'] },
                logistics: { title: 'Head of Agency / OPD', items: ['Draft checking before signature', 'Compliance assurance', 'Risk mitigation'] },
                agency: { title: 'BPK & BPKP', items: ['On-chain audit trail access', 'Accurate comparison data', 'In-depth investigation'] },
                clinic: { title: 'Public & Journalists', items: ['Budget transparency', 'Track decision trails', 'Public accountability'] }
            }
        },
        cta: {
            badge: 'Realize Clean Government',
            title1: 'Ready to Stop Regional Budget',
            title2: 'Waste?',
            description: 'Transform from passive checking to autonomous, intelligent, and transparent financial oversight.',
            btnStart: 'Test the Audit System',
            btnConsult: 'Technical Discussion',
            foot: 'Built for a More Accountable Indonesia'
        },
        collaboration: {
            badge: 'Automated Oversight',
            title1: 'Financial Oversight',
            title2: 'Without Compromise.',
            description: 'A combination of historical procurement data, legal regulations, and autonomous agents to ensure no loopholes for markups.',
            cards: {
                project: {
                    title: 'Fact Synchronization',
                    desc: 'Instantly access 4GB+ of SIRUP data and millions of words from Regional Regulation documents.'
                },
                updates: {
                    title: 'Real-time Debate Logs',
                    desc: 'Monitor live how the AI Auditor and AI Compliance reach conclusions.'
                },
                workflow: {
                    title: 'Blockchain Integrity',
                    desc: 'Seal audit results in seconds. Prove document integrity in the future without a doubt.',
                    cta: 'View Sample Report'
                }
            }
        },
        faq: {
            title: 'Frequently Asked Questions',
            subtitle: 'Learn more about the Elysian system',
            q1: 'How does AI prevent data hallucinations (Yapping)?',
            a1: 'We use the "Caveman Prompt" technique which forces the LLM to output rigid JSON without free narrative, and operates on pure fact data (Ground Truth).',
            q2: 'What is the role of Blockchain in this system?',
            a2: 'Blockchain (Sepolia Testnet) functions as a Trust Layer. Every AI consensus decision is given a Cryptographic Hash value and permanently stored on-chain so it cannot be modified by anyone (including server admins).',
            q3: 'What if the regulation data in RAG is wrong?',
            a3: 'Elysian has a MongoDB QA Gate architecture. Documents must go through human approval first before being embedded into the Qdrant Vector DB, preventing "dirty data" from being learned by the AI.',
            q4: 'Will local government budget data be distributed to the public?',
            a4: 'No. We can implement a private Blockchain node (Quorum) or a fully on-premise system according to your institution\'s confidentiality policy needs.'
        },
        cta_section: {
            title1: 'First Step Towards',
            title2: 'Maximum Transparency',
            description: 'Let\'s transform from mere checking to autonomous oversight.',
            btn: 'Start Now'
        },
        footer: {
            description: 'Indonesia\'s leading Autonomous Financial Audit Infrastructure. We combine Swarm Intelligence and Blockchain to ensure regional budget transparency, integrity, and accountability.',
            solutions: {
                title: 'Core Technologies',
                items: {
                    docs: 'MiroFish Swarm',
                    finance: 'OpenViking RAG',
                    inventory: 'Nemesis Ground Truth',
                    trends: 'Sepolia Trust Layer',
                    erp: 'Redis Asynchronous'
                }
            },
            support: {
                title: 'Explore',
                items: {
                    help: 'Architecture Whitepaper',
                    api: 'Smart Contract Documentation',
                    status: 'Testnet Status',
                    community: 'Developer Forum',
                    sales: 'Contact Core Team'
                }
            },
            contact: {
                title: 'Contact Us',
                address: 'Jakarta, Indonesia'
            },
            legal: {
                copyright: '© 2026 Elysian Rebirth v3.0.',
                privacy: 'Privacy Policy',
                terms: 'Terms & Conditions',
                accessibility: 'Accessibility Statement'
            }
        },
        cookies: {
            title: 'Cookie Usage',
            description: 'We use cookies for dashboard operational analytics. By continuing, you agree to our cookie policy.',
            accept: 'Accept',
            decline: 'Decline'
        }
    }
};

export type TranslationKeys = typeof translationsEN;
