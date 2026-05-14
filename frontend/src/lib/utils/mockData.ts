import type { IncomingRequest } from "@/lib/components/artisan/artisan-home/incoming-requests/IncomingRequestsCard";

export interface Milestone {
    title: string;
    amount: number;
}

export interface DetailedRequest {
    id: string | number;
    customerAvatar: string;
    customerName: string;
    title: string;
    distance: number;
    createdAt: Date;
    totalAmount: number;
    description: string;
    proposedMilestones: Milestone[];
}

export interface ActiveProject {
    id: string | number;
    customerAvatar: string;
    customerName: string;
    title: string;
    totalAmount: number;
    releasedAmount: number;
    milestones: {
        id: string | number;
        title: string;
        status: 'approved' | 'in-progress' | 'pending' | 'released';
        amount: number;
        releaseDate?: string;
        paymentDetails?: string;
        artisanAmount?: number;
        platformFee?: number;
    }[];
}

export interface FinishedProject {
    id: string | number;
    customerAvatar: string;
    customerName: string;
    title: string;
    totalAmount: number;
    completedDate: Date;
    milestones: {
        id: string | number;
        title: string;
        amount: number;
        releaseDate: string;
        paymentDetails: string;
        artisanAmount: number;
        platformFee: number;
    }[];
}

export interface Transaction {
    id: string | number;
    type: 'earned' | 'withdrawn';
    jobTitle?: string;
    customerName?: string;
    date: Date;
    amount: number;
}

export interface PendingProposal {
    id: string | number;
    customerAvatar: string;
    customerName: string;
    title: string;
    date: string;
    status: "pending" | "accepted" | "rejected";
    totalAmount: number;
}

export const MOCK_REQUESTS: IncomingRequest[] = [
    {
        id: 1,
        customerAvatar: "https://i.pravatar.cc/150?img=1",
        customerName: "Jane Doe",
        title: "Plumbing Repair",
        distance: 2.5,
        totalAmount: 15000,
        description: "Need a plumber to fix a leaking pipe in the kitchen sink. It started yesterday and is making a mess."
    },
    {
        id: 2,
        customerAvatar: "https://i.pravatar.cc/150?img=2",
        customerName: "John Smith",
        title: "Electrical Wiring",
        distance: 5.0,
        totalAmount: 45000,
        description: "Looking for an electrician to wire a new room addition. Must be licensed and experienced."
    },
    {
        id: 3,
        customerAvatar: "https://i.pravatar.cc/150?img=3",
        customerName: "Alice Johnson",
        title: "Carpentry - Custom Wardrobe",
        distance: 1.2,
        totalAmount: 120000,
        description: "Need a skilled carpenter to build a custom wardrobe for the master bedroom. Solid wood preferred."
    },
    {
        id: 4,
        customerAvatar: "https://i.pravatar.cc/150?img=4",
        customerName: "Bob Williams",
        title: "AC Installation",
        distance: 8.5,
        totalAmount: 25000,
        description: "Install two split AC units in the living room and master bedroom. Units are already purchased."
    },
    {
        id: 5,
        customerAvatar: "https://i.pravatar.cc/150?img=5",
        customerName: "Mary Brown",
        title: "House Painting",
        distance: 3.8,
        totalAmount: 85000,
        description: "Interior painting for a 3-bedroom apartment. Needs to be completed before the weekend."
    },
    {
        id: 6,
        customerAvatar: "https://i.pravatar.cc/150?img=6",
        customerName: "David Lee",
        title: "Tile Installation",
        distance: 6.2,
        totalAmount: 60000,
        description: "Lay new floor tiles in the kitchen and dining area. Total area is about 40 sqm."
    },
    {
        id: 7,
        customerAvatar: "https://i.pravatar.cc/150?img=7",
        customerName: "Sarah Taylor",
        title: "Roof Leak Repair",
        distance: 4.1,
        totalAmount: 35000,
        description: "Minor roof leak needs fixing before the rainy season starts. Two-story building."
    },
    {
        id: 8,
        customerAvatar: "https://i.pravatar.cc/150?img=8",
        customerName: "Michael Clark",
        title: "Generator Servicing",
        distance: 0.8,
        totalAmount: 10000,
        description: "Routine maintenance for a 5KVA petrol generator. Change oil, spark plugs, etc."
    },
    {
        id: 9,
        customerAvatar: "https://i.pravatar.cc/150?img=9",
        customerName: "Emily Davis",
        title: "Gate Welding",
        distance: 7.4,
        totalAmount: 18000,
        description: "Weld broken hinges on the main entrance gate and reinforce the lock."
    },
    {
        id: 10,
        customerAvatar: "https://i.pravatar.cc/150?img=10",
        customerName: "James Wilson",
        title: "CCTV Installation",
        distance: 9.3,
        totalAmount: 95000,
        description: "Install a 4-camera CCTV system around the perimeter of the house. System already purchased."
    }
];

export const DETAILED_MOCK_REQUESTS: DetailedRequest[] = [
    {
        id: "req1",
        customerAvatar: "https://i.pravatar.cc/150?img=11",
        customerName: "Sarah Johnson",
        title: "Complete Kitchen Renovation",
        distance: 3.2,
        createdAt: new Date('2024-05-10'),
        totalAmount: 450000,
        description: "Looking for an expert to handle a full kitchen renovation. Includes plumbing, cabinetry, and tiling work.",
        proposedMilestones: [
            { title: "Plumbing and Electrical", amount: 150000 },
            { title: "Cabinetry Installation", amount: 200000 },
            { title: "Tiling and Finishing", amount: 100000 }
        ]
    },
    {
        id: "req2",
        customerAvatar: "https://i.pravatar.cc/150?img=12",
        customerName: "Michael Okeke",
        title: "Office Space Painting",
        distance: 1.5,
        createdAt: new Date('2024-05-12'),
        totalAmount: 85000,
        description: "Need the entire office floor painted. Approximately 1200 sq ft. High quality emulsion paint required.",
        proposedMilestones: [
            { title: "Surface Preparation", amount: 25000 },
            { title: "First Coat and Ceiling", amount: 30000 },
            { title: "Final Finishing", amount: 30000 }
        ]
    },
    {
        id: "req3",
        customerAvatar: "https://i.pravatar.cc/150?img=13",
        customerName: "Chidi Okafor",
        title: "Modern Fence Design",
        distance: 5.7,
        createdAt: new Date('2024-05-14'),
        totalAmount: 280000,
        description: "Weld a modern laser-cut design fence for a residential building. Should include an automated gate feature.",
        proposedMilestones: [
            { title: "Design and Material Sourcing", amount: 80000 },
            { title: "Fabrication of Panels", amount: 120000 },
            { title: "Installation and Automation", amount: 80000 }
        ]
    },
    {
        id: "req4",
        customerAvatar: "https://i.pravatar.cc/150?img=15",
        customerName: "Tomás García",
        title: "Kitchen Island with Butcher Block",
        distance: 0.6,
        createdAt: new Date('2024-05-15'),
        totalAmount: 95000,
        description: "Need a freestanding kitchen island with a hardwood butcher block top and storage below. About 4x2 ft.",
        proposedMilestones: [
            { title: "Deposit & Materials", amount: 35000 },
            { title: "Completion", amount: 60000 }
        ]
    }
];

export const MOCK_ACTIVE_PROJECTS: ActiveProject[] = [
    {
        id: "proj1",
        customerAvatar: "https://i.pravatar.cc/150?img=20",
        customerName: "Blessing Enang",
        title: "Modern Wardrobe Construction",
        totalAmount: 150000,
        releasedAmount: 75000,
        milestones: [
            { 
                id: "m1", 
                title: "Stripping Complete",
                status: "released", 
                amount: 20000,
                releaseDate: "Released on 14 May",
                paymentDetails: "Paid via Squad · 90% to artisan · 10% platform fee",
                artisanAmount: 18000,
                platformFee: 2000
            },
            { id: "m2", title: "Foundation Set", status: "released", amount: 55000 },
            { id: "m3", title: "Main Frame", status: "in-progress", amount: 45000 },
            { id: "m4", title: "Polishing", status: "pending", amount: 30000 }
        ]
    },
    {
        id: "proj2",
        customerAvatar: "https://i.pravatar.cc/150?img=21",
        customerName: "Tunde Ednut",
        title: "Full House Rewiring",
        totalAmount: 300000,
        releasedAmount: 100000,
        milestones: [
            { id: "m1", title: "Phase 1: Ground Floor", status: "released", amount: 100000 },
            { id: "m2", title: "Phase 2: Upper Floor", status: "in-progress", amount: 120000 },
            { id: "m3", title: "Phase 3: Final Testing", status: "pending", amount: 80000 }
        ]
    },
    {
        id: "proj3",
        customerAvatar: "https://i.pravatar.cc/150?img=22",
        customerName: "Aisha Bello",
        title: "Luxury Salon Painting",
        totalAmount: 90000,
        releasedAmount: 90000,
        milestones: [
            { id: "m1", title: "Interior Walls", status: "released", amount: 50000 },
            { id: "m2", title: "Exterior Facade", status: "released", amount: 40000 }
        ]
    },
    {
        id: "proj4",
        customerAvatar: "https://i.pravatar.cc/150?img=23",
        customerName: "Emeka Obi",
        title: "Kitchen Sink Repair",
        totalAmount: 15000,
        releasedAmount: 0,
        milestones: [
            { id: "m1", title: "Unclogging and Pipe Fix", status: "in-progress", amount: 15000 }
        ]
    },
    {
        id: "proj5",
        customerAvatar: "https://i.pravatar.cc/150?img=24",
        customerName: "Oluwatobi Ade",
        title: "Roof Leak Plugging",
        totalAmount: 45000,
        releasedAmount: 22500,
        milestones: [
            { id: "m1", title: "Surface Cleaning", status: "released", amount: 22500 },
            { id: "m2", title: "Sealant Application", status: "in-progress", amount: 22500 }
        ]
    }
];

export const MOCK_FINISHED_PROJECTS: FinishedProject[] = [
    {
        id: "fin1",
        customerAvatar: "https://i.pravatar.cc/150?img=30",
        customerName: "Obinna Eze",
        title: "Dining Table Set",
        totalAmount: 85000,
        completedDate: new Date('2024-04-15'),
        milestones: [
            {
                id: "m1",
                title: "Material Sourcing",
                amount: 30000,
                releaseDate: "Released on 10 April",
                paymentDetails: "Paid via Squad · 90% to artisan · 10% platform fee",
                artisanAmount: 27000,
                platformFee: 3000
            },
            {
                id: "m2",
                title: "Construction & Assembly",
                amount: 40000,
                releaseDate: "Released on 12 April",
                paymentDetails: "Paid via Squad · 90% to artisan · 10% platform fee",
                artisanAmount: 36000,
                platformFee: 4000
            },
            {
                id: "m3",
                title: "Polishing & Delivery",
                amount: 15000,
                releaseDate: "Released on 15 April",
                paymentDetails: "Paid via Squad · 90% to artisan · 10% platform fee",
                artisanAmount: 13500,
                platformFee: 1500
            }
        ]
    },
    {
        id: "fin2",
        customerAvatar: "https://i.pravatar.cc/150?img=31",
        customerName: "Fatima Yusuf",
        title: "Storefront Glass Repair",
        totalAmount: 40000,
        completedDate: new Date('2024-04-10'),
        milestones: [
            {
                id: "m1",
                title: "Glass Procurement",
                amount: 25000,
                releaseDate: "Released on 8 April",
                paymentDetails: "Paid via Squad · 90% to artisan · 10% platform fee",
                artisanAmount: 22500,
                platformFee: 2500
            },
            {
                id: "m2",
                title: "Installation",
                amount: 15000,
                releaseDate: "Released on 10 April",
                paymentDetails: "Paid via Squad · 90% to artisan · 10% platform fee",
                artisanAmount: 13500,
                platformFee: 1500
            }
        ]
    },
    {
        id: "fin3",
        customerAvatar: "https://i.pravatar.cc/150?img=32",
        customerName: "Samuel Ade",
        title: "Main Gate Painting",
        totalAmount: 25000,
        completedDate: new Date('2024-04-05'),
        milestones: [
            {
                id: "m1",
                title: "Scraping & Priming",
                amount: 10000,
                releaseDate: "Released on 3 April",
                paymentDetails: "Paid via Squad · 90% to artisan · 10% platform fee",
                artisanAmount: 9000,
                platformFee: 1000
            },
            {
                id: "m2",
                title: "Final Coats",
                amount: 15000,
                releaseDate: "Released on 5 April",
                paymentDetails: "Paid via Squad · 90% to artisan · 10% platform fee",
                artisanAmount: 13500,
                platformFee: 1500
            }
        ]
    },
    {
        id: "fin4",
        customerAvatar: "https://i.pravatar.cc/150?img=33",
        customerName: "Grace Anini",
        title: "Water Tank Stand",
        totalAmount: 55000,
        completedDate: new Date('2024-03-28'),
        milestones: [
            {
                id: "m1",
                title: "Metal Fabrication",
                amount: 35000,
                releaseDate: "Released on 25 March",
                paymentDetails: "Paid via Squad · 90% to artisan · 10% platform fee",
                artisanAmount: 31500,
                platformFee: 3500
            },
            {
                id: "m2",
                title: "Installation & Welding",
                amount: 20000,
                releaseDate: "Released on 28 March",
                paymentDetails: "Paid via Squad · 90% to artisan · 10% platform fee",
                artisanAmount: 18000,
                platformFee: 2000
            }
        ]
    },
    {
        id: "fin5",
        customerAvatar: "https://i.pravatar.cc/150?img=34",
        customerName: "Yinka Salami",
        title: "Office Chair Reupholstery",
        totalAmount: 18000,
        completedDate: new Date('2024-03-20'),
        milestones: [
            {
                id: "m1",
                title: "Fabric Sourcing & Padding",
                amount: 10000,
                releaseDate: "Released on 18 March",
                paymentDetails: "Paid via Squad · 90% to artisan · 10% platform fee",
                artisanAmount: 9000,
                platformFee: 1000
            },
            {
                id: "m2",
                title: "Reupholstery Work",
                amount: 8000,
                releaseDate: "Released on 20 March",
                paymentDetails: "Paid via Squad · 90% to artisan · 10% platform fee",
                artisanAmount: 7200,
                platformFee: 800
            }
        ]
    }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
    {
        id: "t1",
        type: "earned",
        jobTitle: "Modern Wardrobe Construction",
        customerName: "Blessing Enang",
        date: new Date('2024-05-12'),
        amount: 25000
    },
    {
        id: "t2",
        type: "withdrawn",
        date: new Date('2024-05-10'),
        amount: 45000
    },
    {
        id: "t3",
        type: "earned",
        jobTitle: "Dining Table Set",
        customerName: "Obinna Eze",
        date: new Date('2024-05-08'),
        amount: 85000
    },
    {
        id: "t4",
        type: "earned",
        jobTitle: "Luxury Salon Painting",
        customerName: "Aisha Bello",
        date: new Date('2024-05-05'),
        amount: 45000
    },
    {
        id: "t5",
        type: "withdrawn",
        date: new Date('2024-05-01'),
        amount: 15000
    }
];

export const MOCK_PENDING_PROPOSALS: PendingProposal[] = [
    {
        id: "prop1",
        customerAvatar: "https://i.pravatar.cc/150?img=40",
        customerName: "David Olatunji",
        title: "Wardrobe Polishing",
        date: "14 May 2024",
        status: "pending",
        totalAmount: 45000
    },
    {
        id: "prop2",
        customerAvatar: "https://i.pravatar.cc/150?img=41",
        customerName: "Grace Aminu",
        title: "Kitchen Sink Fix",
        date: "12 May 2024",
        status: "pending",
        totalAmount: 12000
    },
    {
        id: "prop3",
        customerAvatar: "https://i.pravatar.cc/150?img=42",
        customerName: "Samuel Johnson",
        title: "Door Lock Installation",
        date: "10 May 2024",
        status: "pending",
        totalAmount: 8000
    }
];