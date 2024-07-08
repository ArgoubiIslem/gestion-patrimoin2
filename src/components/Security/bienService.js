import axios from 'axios';

const API_URL = 'http://localhost:8081/api/biens';

const getBiens = async (token) => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const getBienById = async (id, token) => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const createBien = async (bien, token) => {
  const response = await axios.post(API_URL, bien, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const updateBien = async (bien, token) => {
  const response = await axios.put(`${API_URL}/${bien.id}`, bien, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const deleteBien = async (id, token) => {
  await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export { getBiens, getBienById, createBien, updateBien, deleteBien };
