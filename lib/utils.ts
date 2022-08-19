export const storage = {
  getToken: () =>
    window.localStorage.getItem('accessToken')
      ? JSON.parse(window.localStorage.getItem('accessToken') || '')
      : '',
  setToken: (token: string) => window.localStorage.setItem('accessToken', JSON.stringify(token)),
  clearToken: () => window.localStorage.removeItem('accessToken'),
};
