import axios from 'axios';
import { initReactQueryAuth } from './Auth';
import { storage } from '../../lib/utils';
import { AuthResponse } from '../../types/AuthResponse';
import { User } from '../../types/User';

export async function handleUserResponse(data: AuthResponse) {
  const { accessToken: jwt, user } = data;
  storage.setToken(jwt);
  return user;
}

async function loadUser() {
  let user = null;

  if (storage.getToken()) {
    user = await axios
      .get('/api/auth/me', {
        headers: {
          authorization: `Bearer ${storage.getToken()}`,
        },
      })
      .then((res) => res.data?.user);
  }
  return user;
}

async function loginFn(data: { username: string; password: string }) {
  const response = await axios.post('/api/auth/signin', data);
  const user = await handleUserResponse(response.data);
  return user;
}

async function registerFn(data: { username: string; password: string; email: string }) {
  const response = await axios.post('/api/auth/signup', data);
  const user = await handleUserResponse(response.data);
  return user;
}

async function logoutFn() {
  await storage.clearToken();
}

const authConfig = {
  loadUser,
  loginFn,
  registerFn,
  logoutFn,
};

const { AuthProvider, useAuth } = initReactQueryAuth<User>(authConfig);

export { AuthProvider, useAuth };
