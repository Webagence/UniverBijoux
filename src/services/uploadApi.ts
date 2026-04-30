import api from './api';

export const uploadApi = {
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const { data } = await api.post('/uploads/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.url;
  },

  uploadMultiple: async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images[]', file));
    const { data } = await api.post('/uploads/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.urls;
  },
};
