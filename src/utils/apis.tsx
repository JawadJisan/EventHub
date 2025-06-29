import api from "./axios";

// Event API functions
export const getEvents = async (
  params: Record<string, string | number | undefined> = {}
) => {
  try {
    // Filter out undefined parameters
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    );

    const response = await api.get("/events", { params: filteredParams });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Network error" };
  }
};
