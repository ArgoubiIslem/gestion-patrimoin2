import axios from 'axios';

const API_URL = 'http://localhost:8081/api/activities';

const getActivities = async (token) => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const getActivityById = async (id, token) => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const createActivity = async (activity, token) => {
  const response = await axios.post(API_URL, activity, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const updateActivity = async (activity, token) => {
  const response = await axios.put(`${API_URL}/${activity.id}`, activity, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const deleteActivity = async (id, token) => {
  await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export {
  getActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
};
