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

export const getMyEvents = async (
  params: Record<string, string | number | undefined> = {}
) => {
  try {
    // Filter out undefined parameters
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    );

    const response = await api.get("/events/my-events", {
      params: filteredParams,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Network error" };
  }
};

// Add this delete function
export const deleteEvent = async (eventId: string) => {
  try {
    const response = await api.delete(`/events/${eventId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Network error" };
  }
};
