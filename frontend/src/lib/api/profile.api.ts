import { mockResponse, delay } from "./apiUtils";

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
    role: "client" | "artisan";
    locations: ProfileLocation[];
}

export interface ProfileLocation {
    id: string;
    state: string;
    city: string;
    lga: string;
    address: string;
    isPrimary: boolean;
}

export interface ArtisanProfile extends UserProfile {
    title: string;
    skills: string[];
    portfolio: PortfolioItem[];
    experience: string;
    hourlyPrice?: string; // e.g. "5000"
}

export interface PortfolioItem {
    id: string;
    title: string;
    image: string;
    description?: string;
}

const MOCK_CLIENT_PROFILE: UserProfile = {
    id: "c1",
    name: "John Doe",
    email: "john@example.com",
    role: "client",
    locations: [
        { id: "loc1", state: "Lagos", city: "Lekki", lga: "Eti-Osa", address: "123 Admiralty Way", isPrimary: true }
    ]
};

const MOCK_ARTISAN_PROFILE: ArtisanProfile = {
    id: "a1",
    name: "Tunde Adeyemi",
    email: "tunde@example.com",
    role: "artisan",
    title: "Master Carpenter",
    bio: "Passionate about creating custom furniture that lasts for generations.",
    skills: ["Carpentry", "Woodwork", "Finishing", "Roofing"],
    experience: "10+ years",
    hourlyPrice: "5000",
    locations: [
        { id: "loc2", state: "Lagos", city: "Yaba", lga: "Mainland", address: "45 Herbert Macaulay Way", isPrimary: true }
    ],
    portfolio: [
        { id: "p1", title: "Oak Bookshelf", image: "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&q=80&w=300" },
        { id: "p2", title: "Modern Wardrobe", image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=300" }
    ]
};

const ALL_SKILLS = [
    "Carpentry", "Plumbing", "Electrical", "Painting", "Masonry", 
    "Tiling", "Roofing", "Welding", "Mechanic", "Tailoring",
    "Hairdressing", "Catering", "Interior Design", "Woodwork", "Finishing"
];

export const profileApi = {
    getProfile: async (role: "client" | "artisan") => {
        await delay(1000);
        return mockResponse(role === "artisan" ? MOCK_ARTISAN_PROFILE : MOCK_CLIENT_PROFILE);
    },

    updateProfile: async (data: Partial<ArtisanProfile>) => {
        await delay(1500);
        return mockResponse(data, true, "Profile updated successfully");
    },

    changePassword: async (_old: string, _new: string) => {
        await delay(1200);
        return mockResponse(null, true, "Password changed successfully");
    },

    updateLocations: async (locations: ProfileLocation[]) => {
        await delay(1000);
        return mockResponse(locations, true, "Locations updated");
    },

    uploadPortfolio: async (item: Omit<PortfolioItem, "id">) => {
        await delay(2000);
        const newItem = { ...item, id: `p${Date.now()}` };
        return mockResponse(newItem, true, "Portfolio item uploaded");
    },

    deletePortfolio: async (id: string) => {
        await delay(800);
        return mockResponse(id, true, "Portfolio item deleted");
    },

    getAvailableSkills: async () => {
        await delay(500);
        return mockResponse(ALL_SKILLS);
    }
};
