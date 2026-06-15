export const getResponseData = (response, fallback = null) => {
  if (response?.data?.data !== undefined) {
    return response.data.data;
  }

  if (response?.data !== undefined) {
    return response.data;
  }

  return fallback;
};

export const getResponseList = (response) => {
  const data = getResponseData(response, []);
  return Array.isArray(data) ? data : [];
};
