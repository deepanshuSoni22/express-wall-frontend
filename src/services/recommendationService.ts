export const recommendationService = {
  async prepareRecommendations(text?: string) {
    const body = text ? JSON.stringify({ text }) : JSON.stringify({});
    const response = await fetch('http://localhost:8000/api/prepare-recommendations/', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body
    });
    return response.json();
  },

  async getRecommendationStatus() {
    const response = await fetch('http://localhost:8000/api/recommendation-status/', {
      credentials: 'include'
    });
    return response.json();
  },

  async getRecommendations(text?: string) {
    // Always use POST method with JSON body for input-aware caching
    const response = await fetch('http://localhost:8000/api/recommendations/', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text || '' })
    });
    return response.json();
  },

  async getRecommendationHistory(limit = 10) {
    const response = await fetch(`http://localhost:8000/api/my-recommendations/?limit=${limit}`, {
      credentials: 'include'
    });
    return response.json();
  },

  async clearCache() {
    const response = await fetch('http://localhost:8000/api/clear-cache/', {
      method: 'DELETE',
      credentials: 'include'
    });
    return response.json();
  }
};