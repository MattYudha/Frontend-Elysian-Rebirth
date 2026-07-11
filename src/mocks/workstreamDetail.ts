export const mockWorkstreamDetail = {
    id: "3",
    title: "AI Learning Platform",
    tenant: "HealthPlus",
    status: "Active",
    assignment: "Assigned to me",
    priority: "Urgent",
    sprints: "Revamp 3 weeks",
    lastSync: "Just now",
    estimate: "1 months",
    dueDate: "Dec 31, 2026",
    daysRemainingPct: 30, // UI progress bar calculation
    daysRemainingText: "21 Days to go",

    metadata: {
        status: "Active",
        group: "None",
        priority: "Urgent",
        label: "Design",
        pic: {
            name: "Maria Gomez",
            avatar: ""
        },
        support: "5",
        client: {
            name: "HealthPlus",
            contact: "maria.gomez@healthplus.example"
        }
    },

    overview: {
        description: "Project for HealthPlus. This is mock content that will be replaced by API later.",
        inScope: [
            "Define scope",
            "Draft solution",
            "Validate with stakeholders",
            "Prepare handoff"
        ],
        outOfScope: [
            "Backend logic changes",
            "Marketing landing pages"
        ],
        expectedOutcomes: [
            "Reduce steps and improve usability",
            "Increase success rate",
            "Deliver production-ready UI"
        ],
        keyFeatures: {
            P0: ["Core user flow"],
            P1: ["Filters and empty states"],
            P2: ["Visual polish"]
        }
    },

    // TimelineGantt props data mapped for this specific workflow context
    timeline: [
        {
            id: "t1",
            name: "Design System Audit",
            status: "completed" as const,
            startDate: new Date("2026-12-22"),
            endDate: new Date("2026-12-23"),
            progressPct: 100
        },
        {
            id: "t2",
            name: "Wireframing P0 Flows",
            status: "completed" as const,
            startDate: new Date("2026-12-23"),
            endDate: new Date("2026-12-24"),
            progressPct: 100
        },
        {
            id: "t3",
            name: "High Fidelity UI",
            status: "processing" as const,
            startDate: new Date("2026-12-24"),
            endDate: new Date("2026-12-27"),
            progressPct: 40
        }
    ]
};
