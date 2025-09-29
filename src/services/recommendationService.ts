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
  },

  async processAudio(audioBlob: Blob) {
    const formData = new FormData();
    
    // Add the audio file with proper filename and extension
    const filename = `recording_${Date.now()}.webm`;
    formData.append('audio', audioBlob, filename);
    
    console.log('🔄 Sending FormData to /api/process/ with:', {
      filename,
      size: audioBlob.size,
      type: audioBlob.type
    });
    
    const response = await fetch('http://localhost:8000/api/process/', {
      method: 'POST',
      credentials: 'include',
      body: formData // No Content-Type header for FormData
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Backend error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Backend error ${response.status}: ${errorText}`);
    }
    
    return response.json();
  }
};