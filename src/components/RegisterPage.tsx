import Button, { ButtonGroup } from './Button';
import ErrorAlertList, { Errors } from './ErrorAlertList';
import React, { ChangeEvent, FC, MouseEvent, useCallback, useState } from 'react';
import authService, { RegisterUser } from '../common/services/AuthService';

import Container from './Container';
import { Error } from '../common/context/NotificationContextProvider';
import Input from './Input';
import Title from './Title';
import { useHistory } from 'react-router-dom';
import { useLoader } from '../common/context/LoaderContextProvider';

const RegisterPage: FC = () => {
	const [user, setUser] = useState<RegisterUser>({
		firstName: '',
		lastName: '',
		email: '',
		username: '',
		password: '',
		password2: '',
	});
	const [errors, setErrors] = useState<Errors>([]);
	const { showLoader } = useLoader();
	const history = useHistory();

	const handleError = useCallback(
		(err: Error) => {
			if (err && err.error && err.error.length) {
				setErrors(err.error.map((msg) => msg));
			}
		},
		[errors],
	);

	const register = useCallback(async () => {
		try {
			showLoader(true);
			await authService.register(user);
			window.location.href = '/login';
		} catch (err) {
			showLoader(false);
			handleError(err as Error);
		}
	}, [user, handleError]);

	const validateRegister = useCallback(() => {
		const { firstName, lastName, email, username, password, password2 } = user;
		const errorList = [];

		if (!firstName) {
			errorList.push('First name');
		}

		if (!lastName) {
			errorList.push('Last name');
		}

		if (!email) {
			errorList.push('Email');
		}

		if (!username) {
			errorList.push('Username');
		}

		if (!password) {
			errorList.push('Password');
		}

		if (!password2) {
			errorList.push({ message: 'Repeat password', standalone: true });
		} else if (password !== password2) {
			errorList.push({ message: 'Passwords must match.', standalone: true });
		}

		setErrors(errorList);
		const hasErrors = errorList.length;
		return !!hasErrors;
	}, [user]);

	const handleRegister = useCallback(
		(e: ChangeEvent<HTMLFormElement>) => {
			e.preventDefault();
			if (validateRegister()) {
				return;
			}
			register();
		},
		[register, validateRegister],
	);

	const redirectToLoginPage = useCallback(
		(e: MouseEvent<HTMLButtonElement>) => {
			e.stopPropagation();
			history.push('/login');
		},
		[history],
	);

	const handleChange = ({ target: { name, value } }: ChangeEvent<HTMLInputElement>) =>
		setUser((currentUser) => ({ ...currentUser, [name]: value }));

	const { firstName, lastName, username, email, password, password2 } = user;
	return (
		<Container margin={1}>
			<form onSubmit={handleRegister}>
				<Title>Register</Title>
				<ErrorAlertList errors={errors} />
				<Input
					type="text"
					placeholder="First name"
					label="First name"
					name="firstName"
					value={firstName}
					onChange={handleChange}
				/>
				<Input
					type="text"
					placeholder="Last name"
					label="Last name"
					name="lastName"
					value={lastName}
					onChange={handleChange}
				/>
				<Input
					type="text"
					placeholder="Username"
					label="Username"
					name="username"
					value={username}
					onChange={handleChange}
				/>
				<Input
					name="email"
					value={email}
					onChange={handleChange}
					type="email"
					placeholder="Enter email"
					label="Email address"
				/>
				<Input
					name="password"
					value={password}
					onChange={handleChange}
					type="password"
					placeholder="Password"
					label="Password"
				/>
				<Input
					name="password2"
					value={password2}
					onChange={handleChange}
					type="password"
					placeholder="Repeat password"
					label="Repeat password"
				/>
				<ButtonGroup>
					<Button onClick={redirectToLoginPage} variant="outline-primary">
						Go Back to Login
					</Button>
					<Button type="submit">Register</Button>
				</ButtonGroup>
			</form>
		</Container>
	);
};

export default RegisterPage;
