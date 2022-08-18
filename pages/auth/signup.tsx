import {
  Anchor,
  Box,
  Button,
  Center,
  Container,
  createStyles,
  PasswordInput,
  Popover,
  Progress,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { NextLink } from '@mantine/next';
import { useForm } from '@mantine/form';
import { IconCheck, IconX } from '@tabler/icons';
import { forwardRef, useState } from 'react';
import axios from 'axios';
import { showNotification } from '@mantine/notifications';
import { validateEmail } from '../../lib/validateEmail';

const useStyles = createStyles(() => ({
  container: {
    height: '100vh',
  },
  wrapper: {
    height: '100%',
  },
  input: {
    width: '300px',
  },
}));

function PasswordRequirement({ meets, label }: { meets: boolean; label: string }) {
  return (
    <Text color={meets ? 'teal' : 'red'} mt={5} size="sm">
      <Center inline>
        {meets ? <IconCheck size={14} stroke={1.5} /> : <IconX size={14} stroke={1.5} />}
        <Box ml={7}>{label}</Box>
      </Center>
    </Text>
  );
}

const requirements = [
  { re: /[0-9]/, label: 'Включает в себя цифры' },
  { re: /[a-z]/, label: 'Включает в себя буквы нижнего регистра' },
  { re: /[A-Z]/, label: 'Включает в себя буквы верхнего регистра' },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Содержит спец. символ' },
];

function getStrength(password: string) {
  let multiplier = password.length > 5 ? 0 : 1;

  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 0);
}

const InputWithChecks = forwardRef(({ ...props }: any, ref) => {
  const [popoverOpened, setPopoverOpened] = useState(false);
  const [value, setValue] = useState('');
  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement key={index} label={requirement.label} meets={requirement.re.test(value)} />
  ));

  const strength = getStrength(value);
  const color = strength === 100 ? 'teal' : strength > 50 ? 'yellow' : 'red';

  return (
    <Popover opened={popoverOpened} position="bottom" width="target" transition="pop">
      <Popover.Target>
        <div
          onFocusCapture={() => setPopoverOpened(true)}
          onBlurCapture={() => setPopoverOpened(false)}
        >
          <PasswordInput
            {...props}
            onChange={(event) => {
              props.onChange && props.onChange(event);
              setValue(event.currentTarget.value);
            }}
            ref={ref}
          />
        </div>
      </Popover.Target>
      <Popover.Dropdown>
        <Progress color={color} value={strength} size={5} style={{ marginBottom: 10 }} />
        <PasswordRequirement label="Содержит минимум 6 символов" meets={value.length > 5} />
        {checks}
      </Popover.Dropdown>
    </Popover>
  );
});

export default function SignUp() {
  const { classes } = useStyles();

  const form = useForm({
    initialValues: {
      username: '',
      email: '',
      password: '',
      passwordConfirm: '',
    },
    validate: {
      username: (value) => {
        if (!/^[А-Яа-яA-Za-z0-9]+(?:[ _-][А-Яа-яA-Za-z0-9]+)*$/.test(value)) {
          return 'Никнейм содержит недопустимые символы';
        }
        if (value.length < 5) {
          return 'Минимум 5 символов';
        }
        if (value.length > 20) {
          return 'Максимум 20 символов';
        }
        return null;
      },
      email: (value) => (validateEmail(value) ? null : 'Некорректный email'),
      password: (value) =>
        value.length < 6 || value.length > 20
          ? 'Длина пароля должна быть от 6 до 20 символов'
          : null,
      passwordConfirm: (value, values) =>
        value !== values.password ? 'Пароли не совпадают' : null,
    },
  });

  const handleSubmit = (data: typeof form.values) => {
    axios
      .post('/api/auth/signup', data)
      .then((res) => {
        console.log(res.data);
      })
      .catch((e) => {
        console.log(e);
        showNotification({
          title: 'Ошибка',
          message: e.response.data.message,
          color: 'red',
        });
      });
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Container className={classes.container} size="xs">
        <Stack justify="center" align="center" sx={{ height: '100%' }}>
          <Title order={2}>Регистрация</Title>
          <TextInput
            label="Никнейм"
            className={classes.input}
            required
            {...form.getInputProps('username')}
          />
          <TextInput
            label="Email"
            className={classes.input}
            required
            {...form.getInputProps('email')}
          />
          <InputWithChecks
            label="Пароль"
            className={classes.input}
            required
            {...form.getInputProps('password')}
          />
          <InputWithChecks
            label="Пароль ещё раз"
            className={classes.input}
            required
            {...form.getInputProps('passwordConfirm')}
          />
          <Button type="submit" className={classes.input}>
            Регистрация
          </Button>
          <Anchor component={NextLink} href="/auth/signin">
            Есть аккаунт?
          </Anchor>
          <Anchor component={NextLink} href="/">
            На главную
          </Anchor>
        </Stack>
      </Container>
    </form>
  );
}
