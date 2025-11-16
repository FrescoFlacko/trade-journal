const API_BASE_URL = '/api';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  getAuthHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async request(url, options = {}) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    });

    if (response.status === 401) {
      this.setToken(null);
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    if (response.status === 204) {
      return null;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'An error occurred');
    }

    return data;
  }

  // Auth endpoints
  async register(email, username, password) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, username, password }),
    });
  }

  async login(username, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    this.setToken(data.access_token);
    return data;
  }

  logout() {
    this.setToken(null);
  }

  // Strategy endpoints
  async getStrategies() {
    return this.request('/strategies/');
  }

  async createStrategy(strategy) {
    return this.request('/strategies/', {
      method: 'POST',
      body: JSON.stringify(strategy),
    });
  }

  async updateStrategy(id, strategy) {
    return this.request(`/strategies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(strategy),
    });
  }

  async deleteStrategy(id) {
    return this.request(`/strategies/${id}`, {
      method: 'DELETE',
    });
  }

  // Trade endpoints
  async getTrades() {
    return this.request('/trades/');
  }

  async getTrade(id) {
    return this.request(`/trades/${id}`);
  }

  async createTrade(trade) {
    return this.request('/trades/', {
      method: 'POST',
      body: JSON.stringify(trade),
    });
  }

  async updateTrade(id, trade) {
    return this.request(`/trades/${id}`, {
      method: 'PUT',
      body: JSON.stringify(trade),
    });
  }

  async deleteTrade(id) {
    return this.request(`/trades/${id}`, {
      method: 'DELETE',
    });
  }

  // Upload endpoint
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || 'Upload failed');
    }

    return response.json();
  }
}

export const apiClient = new ApiClient();
