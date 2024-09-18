

import axios from 'axios';

// Base URL of your backend
const API_BASE_URL = 'http://localhost:3000'; // Adjust the port and address as needed



// Function to upload a file
export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append('file', file);

  return axios.post(`${API_BASE_URL}/files/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Function to fetch all files
export const fetchAllFiles = () => {
  return axios.get(`${API_BASE_URL}/files/getall`);
};

// Function to update a file
export const updateFile = (id, updateData) => {
  return axios.put(`${API_BASE_URL}/files/${id}`, updateData);
};

// Function to delete a file
export const deleteFile = (id) => {
  return axios.delete(`${API_BASE_URL}/files/${id}`);
};

// Function to search files
export const searchFiles = (term) => {
  return axios.get(`${API_BASE_URL}/files/search`, {
    params: { term },
  });
};

// Function to search files
export const searchAge = (years) => {
  return axios.get(`${API_BASE_URL}/files/older-than?years=${years}`, {
    params: { years },
  });
};

// Function to search files
/*export const listFile = (pageSize) => {
  return axios.get(`${API_BASE_URL}/files/list?page=${pageNumber}`, {
    params: { pageSize },
  });
  
};*/

export const listFile = (pageNumber, pageSize) => {
  return axios.get(`${API_BASE_URL}/files`, {
    params: {
      page: pageNumber,
      limit: pageSize,
    },
  });

}


/*export const fetchFiles = async (limit, offset) => {
  try {
    const response = await axios.get(API_BASE_URL, {
      params: { limit, offset },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching files:', error);
    throw error;
  }
};*/