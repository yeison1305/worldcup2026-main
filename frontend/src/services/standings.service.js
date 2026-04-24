import axios from 'axios';

const API_URL = 'http://localhost:3000/api/standings';

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

const getAll = async () => {
  const response = await axios.get(API_URL, { headers: getAuthHeaders() });
  return response.data;
};

const getByGroup = async (group) => {
  const response = await axios.get(`${API_URL}/${group}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export default { getAll, getByGroup };
