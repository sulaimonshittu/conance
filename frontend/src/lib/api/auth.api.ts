import { mockResponse } from "./apiUtils";

export const authApi = {
    login: async (email: string, role: "artisan" | "client") => {
        // Return a detailed profile based on the role
        const artisanDetails = {
            id: "art_123",
            name: "Tunde Adeyemi",
            email: email,
            avatar: "https://i.pravatar.cc/150?u=tunde",
            walletBalance: 45000,
            location: "Lagos, Nigeria",
            about: "Expert carpenter with 10+ years experience in custom furniture and home renovations.",
            title: "Master Carpenter",
            skills: ["Custom Furniture", "Wood Polishing", "Cabinetry"],
            rating: 4.9,
            reviewsCount: 127,
            portfolio: [
                "https://images.unsplash.com/photo-1581421300550-2f9ec6733515?auto=format&fit=crop&q=80&w=400",
                "https://images.unsplash.com/photo-1538629858763-8f85ee75ec32?auto=format&fit=crop&q=80&w=400"
            ]
        };

        const clientDetails = {
            id: "cli_456",
            name: "Jane Smith",
            email: email,
            avatar: "https://i.pravatar.cc/150?img=11",
            walletBalance: 125000,
            location: "Victoria Island, Lagos",
            about: "Frequent user of Conance for home maintenance and office repairs."
        };

        return mockResponse({
            userDetails: role === "artisan" ? artisanDetails : clientDetails,
            role,
        });
    },

    register: async (name: string, email: string, role: "artisan" | "client") => {
        return mockResponse({
            userDetails: { 
                id: Math.random().toString(36).substr(2, 9),
                name, 
                email,
                walletBalance: 0 
            },
            role,
        });
    },

    logout: async () => {
        return mockResponse(null, true, "Logged out successfully");
    }
};
