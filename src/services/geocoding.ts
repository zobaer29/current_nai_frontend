export interface GeocodingResult {
  place_id: string;
  display_name: string;
  lat: number;
  lng: number;
}

export async function searchLocationIQ(query: string): Promise<GeocodingResult[]> {
  const apiKey = import.meta.env.VITE_GEOCODING_API_KEY;
  if (!apiKey || apiKey.includes('example')) {
    return [];
  }

  try {
    const encodedQuery = encodeURIComponent(query.trim());
    const url = `https://us1.locationiq.com/v1/search?key=${apiKey}&q=${encodedQuery}&format=json&countrycodes=bd&limit=5`;
    const response = await fetch(url);
    if (!response.ok) return [];

    const data = await response.json();
    if (!Array.isArray(data)) return [];

    return data.map((item: { place_id: string; display_name: string; lat: string; lon: string }) => ({
      place_id: item.place_id,
      display_name: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
    }));
  } catch (error) {
    console.error('LocationIQ geocoding error:', error);
    return [];
  }
}
