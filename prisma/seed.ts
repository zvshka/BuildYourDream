import AuthService from '../services/Auth.service';

const seeding = async () => {
  await AuthService.signup({
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin1234',
  });
};

seeding();
