import { mockResponse } from "./apiUtils";

export const authApi = {
    login: async (email: string, role: "artisan" | "client") => {
        return mockResponse({
            userDetails: {
                name: "John Doe",
                email: email,
            },
            role,
        });
    },

    register: async (name: string, email: string, role: "artisan" | "client") => {
        return mockResponse({
            userDetails: { name, email },
            role,
        });
    },

    logout: async () => {
        return mockResponse(null, true, "", 500);
    }
};
