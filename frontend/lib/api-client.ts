import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getSession } from 'next-auth/react';
import { SignJWT } from 'jose';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        try {
          const session = await getSession();
          if (session?.user?.email) {
            // Create proper JWT token with user info for backend
            const secretEnv = process.env.NEXT_PUBLIC_NEXTAUTH_SECRET;
            
            if (!secretEnv) {
              console.error('NEXT_PUBLIC_NEXTAUTH_SECRET is not defined');
              return config;
            }

            const secret = new TextEncoder().encode(secretEnv);
            
            const token = await new SignJWT({
              sub: session.user.id || session.user.email,
              email: session.user.email,
              name: session.user.name,
              picture: session.user.image
            })
              .setProtectedHeader({ alg: 'HS256' })
              .setIssuedAt()
              .setExpirationTime('24h')
              .sign(secret);

            config.headers.Authorization = `Bearer ${token}`;
            console.log('JWT token generated successfully');
          } else {
            console.warn('No session found, request will be sent without authentication');
          }
          return config;
        } catch (error) {
          console.error('Error in request interceptor:', error);
          // Continue with request even if token generation fails
          return config;
        }
      },
      (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          const message = error.response.data?.message || 'An error occurred';
          const status = error.response.status;
          console.error('API Error:', message, 'Status:', status, 'Full response:', error.response.data);
          return Promise.reject(new Error(message));
        } else if (error.request) {
          console.error('Network Error:', error.request);
          return Promise.reject(new Error('Network error. Please check your connection.'));
        } else {
          console.error('Error:', error.message);
          return Promise.reject(error);
        }
      }
    );
  }

  // User endpoints
  async getCurrentUser() {
    const response = await this.client.get('/users/me');
    return response.data;
  }

  async getUserProfile(userId: string) {
    const response = await this.client.get(`/users/${userId}`);
    return response.data;
  }

  async updateProfile(data: any) {
    const response = await this.client.patch('/users/me', data);
    return response.data;
  }

  // Commitment endpoints
  async getCommitments(params?: any) {
    const response = await this.client.get('/commitments', { params });
    return response.data;
  }

  async getUserCommitments(userId?: string) {
    try {
      // Use 'me' to get current user's commitments, or specific userId for other users
      const targetUserId = userId || 'me';
      
      console.log('getUserCommitments - requesting for userId:', targetUserId);
      const response = await this.client.get(`/commitments/user/${targetUserId}`);
      return response.data;
    } catch (error) {
      console.error('Error in getUserCommitments:', error);
      throw error;
    }
  }

  async getCommitmentById(id: string) {
    const response = await this.client.get(`/commitments/${id}`);
    return response.data;
  }

  async createCommitment(data: any) {
    const response = await this.client.post('/commitments', data);
    return response.data;
  }

  async updateCommitment(id: string, data: any) {
    const response = await this.client.patch(`/commitments/${id}`, data);
    return response.data;
  }

  async deleteCommitment(id: string) {
    const response = await this.client.delete(`/commitments/${id}`);
    return response.data;
  }

  async likeCommitment(id: string) {
    const response = await this.client.post(`/commitments/${id}/like`);
    return response.data;
  }

  // Comment endpoints
  async getComments(commitmentId: string) {
    const response = await this.client.get(`/commitments/${commitmentId}/comments`);
    return response.data;
  }

  async createComment(commitmentId: string, text: string) {
    const response = await this.client.post(`/commitments/${commitmentId}/comments`, { text });
    return response.data;
  }

  async deleteComment(commitmentId: string, commentId: string) {
    const response = await this.client.delete(`/commitments/${commitmentId}/comments/${commentId}`);
    return response.data;
  }

  // Progress endpoints
  async addProgressUpdate(commitmentId: string, data: any) {
    const response = await this.client.post(`/commitments/${commitmentId}/progress`, data);
    return response.data;
  }

  async getProgressUpdates(commitmentId: string) {
    const response = await this.client.get(`/commitments/${commitmentId}/progress`);
    return response.data;
  }

  async getMilestones(commitmentId: string) {
    const response = await this.client.get(`/commitments/${commitmentId}/milestones`);
    return response.data;
  }

  async getUserDashboard() {
    const response = await this.client.get('/dashboard/me');
    return response.data;
  }

  // Wall/Feed endpoints
  async getWallFeed(params?: any) {
    const response = await this.client.get('/wall', { params });
    return response.data;
  }

  async getWallStats() {
    const response = await this.client.get('/wall/stats');
    return response.data;
  }

  // Notification endpoints
  async getNotifications() {
    const response = await this.client.get('/notifications');
    return response.data;
  }

  async markNotificationRead(id: string) {
    const response = await this.client.patch(`/notifications/${id}/read`);
    return response.data;
  }
}

export const apiClient = new ApiClient();
export default apiClient;
