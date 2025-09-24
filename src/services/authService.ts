// Create new service: src/services/authService.ts
export const authService = {
    async checkSession() {
      const response = await fetch('http://localhost:8000/api/session-status/', {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      return response.json();
    },
  
    async register(name: string, mobile: string) {
      const response = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          mobile_number: mobile 
        })
      });
      return response.json();
    },
  
    async logout() {
      const response = await fetch('http://localhost:8000/api/logout/', {
        method: 'POST',
        credentials: 'include'
      });
      return response.json();
    }
};