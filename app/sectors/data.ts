
export interface Law {
    title: string;
    desc: string;
}

export interface Sector {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    laws: Law[];
}

export const SECTORS_DATA: Sector[] = [
    {
        id: "criminal-law",
        title: "Criminal Law",
        description: "Offenses, punishments, and procedures for criminal acts.",
        icon: "⚖️",
        color: "from-red-500 to-rose-600",
        laws: [
            { title: "IPC Section 302", desc: "Punishment for Murder - Death or life imprisonment." },
            { title: "IPC Section 378", desc: "Theft - Moving movable property without consent." },
            { title: "CrPC Section 41", desc: "Police power to arrest without warrant." },
            { title: "IPC Section 498A", desc: "Cruelty by husband or relatives against a woman." },
            { title: "IPC Section 420", desc: "Cheating and dishonestly inducing delivery of property." },
        ]
    },
    {
        id: "civil-law",
        title: "Civil Law",
        description: "Disputes between individuals/organizations (Property, Contracts).",
        icon: "📜",
        color: "from-blue-500 to-cyan-600",
        laws: [
            { title: "Contract Act Sec 10", desc: "Agreements are contracts if made by free consent." },
            { title: "CPC Order 39", desc: "Temporary injunctions and interlocutory orders." },
            { title: "Specific Relief Act", desc: "Remedies for breach of contract." },
            { title: "Tort Law", desc: "Civil wrongs leading to legal liability (Negligence, Nuisance)." },
        ]
    },
    {
        id: "family-law",
        title: "Family Law",
        description: "Marriage, Divorce, Adoption, and Succession matters.",
        icon: "👨‍👩‍👧‍👦",
        color: "from-pink-500 to-purple-600",
        laws: [
            { title: "Hindu Marriage Act Sec 13", desc: "Grounds for Divorce (Adultery, Cruelty, etc.)." },
            { title: "Domestic Violence Act", desc: "Protection of women from domestic abuse." },
            { title: "Special Marriage Act", desc: "Civil marriage for people of India and all Indian nationals." },
            { title: "Maintenance (CrPC 125)", desc: "Order for maintenance of wives, children, and parents." },
        ]
    },
    {
        id: "cyber-law",
        title: "Cyber Law",
        description: "Legal issues related to the internet, data privacy, and cyber crimes.",
        icon: "💻",
        color: "from-green-400 to-emerald-600",
        laws: [
            { title: "IT Act Section 66A", desc: "Punishment for sending offensive messages (Struck down but relevant context)." },
            { title: "IT Act Section 43", desc: "Penalty and compensation for damage to computer systems." },
            { title: "IT Act Section 66C", desc: "Identity Theft punishment." },
            { title: "IT Act Section 67", desc: "Publishing obscene information in electronic form." },
        ]
    },
    {
        id: "property-law",
        title: "Property Law",
        description: "Ownership, Transfer, and disputes regarding Property.",
        icon: "🏠",
        color: "from-amber-500 to-orange-600",
        laws: [
            { title: "Transfer of Property Act", desc: "Regulations for transfer of property by act of parties." },
            { title: "Section 54", desc: "Sale of immovable property defined." },
            { title: "Rent Control Act", desc: "Regulations for rent and eviction of tenants." },
            { title: "RERA Act", desc: "Regulation and development of the real estate sector." },
        ]
    },
    {
        id: "consumer-protection",
        title: "Consumer Protection",
        description: "Rights of consumers and redressal mechanisms.",
        icon: "🛒",
        color: "from-teal-400 to-cyan-600",
        laws: [
            { title: "CPA 2019 Section 2(9)", desc: "Definition of Consumer Rights." },
            { title: "Right to Safety", desc: "Protection against hazardous goods." },
            { title: "Right to Information", desc: "Right to be informed about quality, quantity, potency." },
            { title: "CPA Section 35", desc: "Filing a complaint in District Commission." },
        ]
    },
    {
        id: "corporate-law",
        title: "Corporate Law",
        description: "Governance, compliance, and operations of corporations.",
        icon: "🏢",
        color: "from-slate-500 to-gray-700",
        laws: [
            { title: "Companies Act Sec 2(20)", desc: "Definition of a Company." },
            { title: "Insolvency Code (IBC)", desc: "Consolidated framework for insolvency and bankruptcy." },
            { title: "CSR (Sec 135)", desc: "Corporate Social Responsibility mandates." },
        ]
    },
    {
        id: "labour-law",
        title: "Labour Law",
        description: "Rights and obligations of workers, union members, and employers.",
        icon: "👷",
        color: "from-yellow-500 to-amber-600",
        laws: [
            { title: "Minimum Wages Act", desc: "Fixing minimum rates of wages for labor." },
            { title: "Factories Act", desc: "Health, safety, and welfare of workers in factories." },
            { title: "Industrial Disputes Act", desc: "Investigation and settlement of industrial disputes." },
        ]
    }
];
