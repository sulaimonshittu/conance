/**
 * Utility to simulate network delay
 */
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Simulates a standard API response structure
 */
export interface ApiResponse<T> {
    data: T | null;
    success: boolean;
    message?: string;
}

/**
 * Helper to create a mock API response with simulated delay
 */
export const mockResponse = async <T>(
    data: T,
    success: boolean = true,
    errorMsg: string = "An error occurred",
    delayMs: number = 800
): Promise<ApiResponse<T>> => {
    await delay(delayMs);
    if (!success) {
        return { data: null, success: false, message: errorMsg };
    }
    return { data, success: true };
};
