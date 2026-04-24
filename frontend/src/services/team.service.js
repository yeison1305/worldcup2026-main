import { api } from './auth.service';

const API_URL = '/teams';

const getTeams = async () => {
  const response = await api.get(API_URL);
  return response.data;
};

const createTeam = async (teamData) => {
  const response = await api.post(API_URL, teamData);
  return response.data;
};

const updateTeam = async (id, teamData) => {
  const response = await api.put(`${API_URL}/${id}`, teamData);
  return response.data;
};

const deleteTeam = async (id) => {
  const response = await api.delete(`${API_URL}/${id}`);
  return response.data;
};

export default { getTeams, createTeam, updateTeam, deleteTeam };
