// services/jobService.ts
import { apiClient } from './apiClient';
import { Job } from '../types';

export const jobService = {
  async getJobSuggestions(role: string): Promise<{ jobs: Job[] }> {
    try {
      // Points to JobController.java @GetMapping
      // You can add query params if you implement filtering on the backend
      const response = await apiClient.get('/jobs');

      return {
        jobs: response.data || []
      };
    } catch (error) {
      console.error('Error fetching jobs from backend:', error);
      return { jobs: [] };
    }
  },

  async searchJobs(query: string): Promise<{ jobs: Job[] }> {
    return this.getJobSuggestions(query);
  }
};