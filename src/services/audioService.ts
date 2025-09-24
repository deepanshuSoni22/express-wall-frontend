export const audioService = {
  async transcribeAudio(audioBlob: Blob) {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    
    const response = await fetch('http://localhost:8000/api/transcribe/', {
      method: 'POST',
      credentials: 'include',
      body: formData
    });
    return response.json();
  }
};