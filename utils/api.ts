export interface ScheduleSuggestionsResponse {
  startPoints: string[];
  endPoints: string[];
}

export async function fetchScheduleSuggestions(): Promise<ScheduleSuggestionsResponse | null> {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/schedule/suggestions`;
    console.log("Fetching from:", apiUrl);

    const response = await fetch(apiUrl);
    console.log("Response status:", response.status);
    
    const text = await response.text(); // Log raw response before parsing
    console.log("Raw response:", text);

    const data = JSON.parse(text);
    console.log("Parsed data:", data);

    if (!data || !Array.isArray(data.startPoints) || !Array.isArray(data.endPoints)) {
      throw new Error("Invalid response format");
    }

    return data as ScheduleSuggestionsResponse;
  } catch (error) {
    console.error("Error fetching schedule suggestions:", error);
    return null;
  }
}
