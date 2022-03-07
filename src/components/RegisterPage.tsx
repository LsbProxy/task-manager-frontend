import { Button, Col, Form, Row } from 'react-bootstrap';
import ErrorAlertList, { Errors } from './ErrorAlertList';
import React, { ChangeEvent, FC, MouseEvent, useCallback, useContext, useState } from 'react';
import authService, { RegisterUser } from '../common/services/AuthService';

import { Error } from '../common/context/NotificationContextProvider';
import { LoaderContext } from '../common/context/LoaderContextProvider';
import { isEmpty } from 'lodash';
import { useHistory } from 'react-router-dom';

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
	const { showLoader } = useContext(LoaderContext);
	const history = useHistory();

	const handleError = useCallback(
		(err: Error) => {
			if (err && !isEmpty(err.error)) {
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
		<Row className="justify-content-center mt-5 pb-5">
			<Col lg="3" md="5">
				<ErrorAlertList errors={errors} />
				<Form onSubmit={handleRegister}>
					<h3 className="py-3">
						<strong>Register</strong>
					</h3>
					<Form.Group className="mb-3" controlId="formFirstName">
						<Form.Label>First name</Form.Label>
						<Form.Control
							type="text"
							placeholder="First name"
							name="firstName"
							value={firstName}
							onChange={handleChange}
						/>
					</Form.Group>
					<Form.Group className="mb-3" controlId="formLastName">
						<Form.Label>Last name</Form.Label>
						<Form.Control
							type="text"
							placeholder="Last name"
							name="lastName"
							value={lastName}
							onChange={handleChange}
						/>
					</Form.Group>
					<Form.Group className="mb-3" controlId="formUsername">
						<Form.Label>Username</Form.Label>
						<Form.Control
							type="text"
							placeholder="Username"
							name="username"
							value={username}
							onChange={handleChange}
						/>
					</Form.Group>
					<Form.Group className="mb-3" controlId="formBasicEmail">
						<Form.Label>Email address</Form.Label>
						<Form.Control
							name="email"
							value={email}
							onChange={handleChange}
							type="email"
							placeholder="Enter email"
						/>
					</Form.Group>
					<Form.Group className="mb-3" controlId="formBasicPassword">
						<Form.Label>Password</Form.Label>
						<Form.Control
							name="password"
							value={password}
							onChange={handleChange}
							type="password"
							placeholder="Password"
						/>
					</Form.Group>
					<Form.Group className="mb-3" controlId="formBasicPassword2">
						<Form.Label>Repeat password</Form.Label>
						<Form.Control
							name="password2"
							value={password2}
							onChange={handleChange}
							type="password"
							placeholder="Repeat password"
						/>
					</Form.Group>
					<Button onClick={redirectToLoginPage} variant="outline-primary">
						Go Back to Login
					</Button>
					<Button variant="primary" type="submit" className="float-end">
						Register
					</Button>
				</Form>
			</Col>
		</Row>
	);
};

export default RegisterPage;
