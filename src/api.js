const API_KEY = 'b6b677eb7d4ec17f700e3d4dfc31d005'; // Legacy key from original project
const BASE_URL = 'https://api.themoviedb.org/3';

export const fetchTrending = async (type = 'all', timeWindow = 'day') => {
    try {
        const response = await fetch(`${BASE_URL}/trending/${type}/${timeWindow}?api_key=${API_KEY}`);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching trending:', error);
        return [];
    }
};

export const searchMulti = async (query) => {
    if (!query) return [];
    try {
        const response = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error searching:', error);
        return [];
    }
};

export const fetchDetails = async (id, type) => {
    try {
        const response = await fetch(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}&append_to_response=credits,similar`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching details:', error);
        return null;
    }
}

export const fetchSeason = async (showId, seasonNumber) => {
    try {
        const response = await fetch(`${BASE_URL}/tv/${showId}/season/${seasonNumber}?api_key=${API_KEY}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching season:', error);
        return null;
    }
};
