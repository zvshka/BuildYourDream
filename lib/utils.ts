export const storage = {
  getToken: () => JSON.parse(window.localStorage.getItem('accessToken') || ''),
  setToken: (token: string) => window.localStorage.setItem('accessToken', JSON.stringify(token)),
  clearToken: () => window.localStorage.removeItem('accessToken'),
};
