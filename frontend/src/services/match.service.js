import axios from 'axios';

const API_URL = 'http://localhost:3000/api/matches';

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

const getAll = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.group) params.append('group', filters.group);
  if (filters.status) params.append('status', filters.status);
  if (filters.round) params.append('round', filters.round);

  const url = params.toString() ? `${API_URL}?${params.toString()}` : API_URL;
  const response = await axios.get(url, { headers: getAuthHeaders() });
  return response.data;
};

const getByGroup = async (letter) => {
  const response = await axios.get(`${API_URL}/group/${letter}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

const getById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

const create = async (matchData) => {
  const response = await axios.post(API_URL, matchData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

const update = async (id, matchData) => {
  const response = await axios.put(`${API_URL}/${id}`, matchData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

const updateResult = async (id, homeScore, awayScore) => {
  const response = await axios.patch(
    `${API_URL}/${id}/result`,
    { homeScore, awayScore },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

const deleteMatch = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export default { getAll, getByGroup, getById, create, update, updateResult, deleteMatch };
