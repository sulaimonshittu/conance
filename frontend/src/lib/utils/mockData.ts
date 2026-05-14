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
        status: 'approved' | 'in-progress' | 'pending';
    }[];
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
            { id: "m1", status: "approved" },
            { id: "m2", status: "approved" },
            { id: "m3", status: "in-progress" },
            { id: "m4", status: "pending" }
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
            { id: "m1", status: "approved" },
            { id: "m2", status: "in-progress" },
            { id: "m3", status: "pending" }
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
            { id: "m1", status: "approved" },
            { id: "m2", status: "approved" }
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
            { id: "m1", status: "in-progress" }
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
            { id: "m1", status: "approved" },
            { id: "m2", status: "in-progress" }
        ]
    }
];