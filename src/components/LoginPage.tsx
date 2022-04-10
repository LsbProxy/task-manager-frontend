import Button, { ButtonGroup } from './Button';
import React, { ChangeEvent, FC, MouseEvent, useCallback, useState } from 'react';

import Alert from './Alert';
import Container from './Container';
import { Error } from '../common/context/NotificationContextProvider';
import ErrorAlertList from './ErrorAlertList';
import Input from './Input';
import Title from './Title';
import authService from '../common/services/AuthService';
import { useHistory } from 'react-router-dom';
import { useLoader } from '../common/context/LoaderContextProvider';

const { REACT_APP_TEST_EMAIL, REACT_APP_TEST_PASSWORD } = process.env;

const LoginPage: FC = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showDisclaimer, setDisclaimer] = useState(true);
	const [errors, setErrors] = useState<string[]>([]);
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

	const login = useCallback(async () => {
		try {
			showLoader(true);

			const user = await authService.login(email, password);

			window.localStorage.setItem('user', JSON.stringify(user));
			window.location.href = '';
		} catch (err) {
			showLoader(false);
			handleError(err as Error);
		}
	}, [email, password, handleError]);

	const validateLogin = useCallback(() => {
		const errorList = [];

		if (!email) {
			errorList.push('Email');
		}
		if (!password) {
			errorList.push('Password');
		}

		setErrors(errorList);
		const hasErrors = errorList.length;
		return !!hasErrors;
	}, [email, password]);

	const handleLogin = useCallback(
		(e: ChangeEvent<HTMLFormElement>) => {
			e.preventDefault();
			if (validateLogin()) {
				return;
			}
			login();
		},
		[login, validateLogin],
	);

	const redirectToRegisterPage = useCallback(
		(e: MouseEvent<HTMLButtonElement>) => {
			e.stopPropagation();
			history.push('/register');
		},
		[history],
	);

	const loginAsTestAdmin = useCallback(async () => {
		try {
			showLoader(true);

			const user = await authService.login(
				REACT_APP_TEST_EMAIL as string,
				REACT_APP_TEST_PASSWORD as string,
			);

			window.localStorage.setItem('user', JSON.stringify(user));
			window.location.href = '';
		} catch (err) {
			showLoader(false);
			handleError(err as Error);
		}
	}, [handleError]);

	return (
		<Container margin={1}>
			<form onSubmit={handleLogin}>
				<Title>Login</Title>
				{REACT_APP_TEST_EMAIL && REACT_APP_TEST_PASSWORD && (
					<Alert
						show={showDisclaimer}
						onClose={() => setDisclaimer(false)}
						variant="warning"
						dismissible
					>
						<p>
							Only Project Managers can:
							<br />
							&nbsp;&nbsp;&nbsp;&nbsp;- create Dashboards and Sprints
							<br />
							&nbsp;&nbsp;&nbsp;&nbsp;- add/update member access
							<br />
							<br />
							An email invitation is neded to register as a Project Manager.
						</p>
						<hr />
						<Container>
							<Button onClick={loginAsTestAdmin} variant="secondary">
								Login as test Project Manager
							</Button>
						</Container>
					</Alert>
				)}
				<ErrorAlertList errors={errors} />
				<Input
					type="email"
					name="email"
					label="Email address"
					placeholder="Enter email"
					value={email}
					onChange={({ target: { value } }) => setEmail(value)}
				/>
				<Input
					type="password"
					name="password"
					label="Password"
					placeholder="Password"
					value={password}
					onChange={({ target: { value } }) => setPassword(value)}
				/>
				<ButtonGroup>
					<Button type="submit">Login</Button>
					<Button onClick={redirectToRegisterPage} variant="outline-primary">
						Register
					</Button>
				</ButtonGroup>
			</form>
		</Container>
	);
};

export default LoginPage;
