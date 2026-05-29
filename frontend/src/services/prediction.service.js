import axios from 'axios';

const API_URL = 'http://localhost:3000/api/predictions';

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

const predict = async (homeTeamName, awayTeamName) => {
  const response = await axios.post(
    API_URL,
    { homeTeamName, awayTeamName },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

const getUpcoming = async () => {
  const response = await axios.get(`${API_URL}/upcoming`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

const getByMatch = async (matchId) => {
  const response = await axios.get(`${API_URL}/match/${matchId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

const generateAll = async () => {
  const response = await axios.post(
    `${API_URL}/generate-all`,
    {},
    { headers: getAuthHeaders() }
  );
  return response.data;
};

const sync = async () => {
  const response = await axios.post(
    `${API_URL}/sync`,
    {},
    { headers: getAuthHeaders() }
  );
  return response.data;
};

const getStats = async () => {
  const response = await axios.get(`${API_URL}/stats`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export default { predict, getUpcoming, getByMatch, generateAll, sync, getStats };
