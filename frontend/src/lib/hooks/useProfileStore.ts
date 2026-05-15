import { create } from "zustand";
import { profileApi, type UserProfile, type ArtisanProfile, type ProfileLocation, type PortfolioItem } from "../api/profile.api";
import { toast } from "sonner";

interface ProfileState {
    profile: UserProfile | ArtisanProfile | null;
    isLoading: boolean;
    isUpdating: boolean;
    error: string | null;
    availableSkills: string[];

    fetchProfile: (role: "client" | "artisan") => Promise<void>;
    fetchAvailableSkills: () => Promise<void>;
    updateProfile: (data: Partial<ArtisanProfile>) => Promise<boolean>;
    updateSkills: (skills: string[]) => Promise<boolean>;
    changePassword: (oldP: string, newP: string) => Promise<boolean>;
    updateLocations: (locations: ProfileLocation[]) => Promise<boolean>;
    addPortfolio: (item: Omit<PortfolioItem, "id">) => Promise<boolean>;
    removePortfolio: (id: string) => Promise<boolean>;
    clearError: () => void;
}

const useProfileStore = create<ProfileState>((set) => ({
    profile: null,
    isLoading: false,
    isUpdating: false,
    error: null,
    availableSkills: [],

    clearError: () => set({ error: null }),

    fetchProfile: async (role) => {
        set({ isLoading: true, error: null });
        try {
            const res = await profileApi.getProfile(role);
            if (res.success && res.data) {
                set({ profile: res.data, isLoading: false });
            } else {
                set({ error: res.message || "Failed to fetch profile", isLoading: false });
            }
        } catch (err) {
            set({ error: "An unexpected error occurred", isLoading: false });
        }
    },

    fetchAvailableSkills: async () => {
        try {
            const res = await profileApi.getAvailableSkills();
            if (res.success && res.data) {
                set({ availableSkills: res.data });
            }
        } catch (err) {
            console.error("Failed to fetch available skills", err);
        }
    },

    updateProfile: async (data) => {
        set({ isUpdating: true, error: null });
        try {
            const res = await profileApi.updateProfile(data);
            if (res.success && res.data) {
                set(state => ({
                    profile: state.profile ? { ...state.profile, ...res.data } : null,
                    isUpdating: false
                }));
                toast.success("Profile updated successfully");
                return true;
            } else {
                set({ error: res.message || "Failed to update profile", isUpdating: false });
                return false;
            }
        } catch (err) {
            set({ error: "An unexpected error occurred", isUpdating: false });
            return false;
        }
    },

    updateSkills: async (skills) => {
        set({ isUpdating: true });
        const res = await profileApi.updateProfile({ skills });
        if (res.success) {
            set(state => ({
                profile: state.profile && "skills" in state.profile 
                    ? { ...state.profile, skills } 
                    : state.profile,
                isUpdating: false
            }));
            toast.success("Skills updated");
            return true;
        }
        set({ isUpdating: false });
        return false;
    },

    changePassword: async (oldP, newP) => {
        set({ isUpdating: true });
        const res = await profileApi.changePassword(oldP, newP);
        set({ isUpdating: false });
        if (res.success) {
            toast.success("Password changed successfully");
            return true;
        }
        toast.error(res.message || "Failed to change password");
        return false;
    },

    updateLocations: async (locations) => {
        set({ isUpdating: true });
        const res = await profileApi.updateLocations(locations);
        if (res.success && res.data) {
            set(state => ({
                profile: state.profile ? { ...state.profile, locations: res.data as ProfileLocation[] } : null,
                isUpdating: false
            }));
            toast.success("Locations updated");
            return true;
        }
        set({ isUpdating: false });
        return false;
    },

    addPortfolio: async (item) => {
        set({ isUpdating: true });
        const res = await profileApi.uploadPortfolio(item);
        if (res.success && res.data) {
            set(state => {
                if (state.profile && "portfolio" in state.profile) {
                    return {
                        profile: {
                            ...state.profile,
                            portfolio: [...state.profile.portfolio, res.data as PortfolioItem]
                        },
                        isUpdating: false
                    };
                }
                return { isUpdating: false };
            });
            toast.success("Portfolio item added");
            return true;
        }
        set({ isUpdating: false });
        return false;
    },

    removePortfolio: async (id) => {
        set({ isUpdating: true });
        const res = await profileApi.deletePortfolio(id);
        if (res.success) {
            set(state => {
                if (state.profile && "portfolio" in state.profile) {
                    return {
                        profile: {
                            ...state.profile,
                            portfolio: state.profile.portfolio.filter(p => p.id !== id)
                        },
                        isUpdating: false
                    };
                }
                return { isUpdating: false };
            });
            toast.success("Portfolio item removed");
            return true;
        }
        set({ isUpdating: false });
        return false;
    }
}));

export default useProfileStore;
