import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import React, { ChangeEvent, FC, MouseEvent, useCallback, useContext, useState } from 'react';

import { Error } from '../common/context/NotificationContextProvider';
import ErrorAlertList from './ErrorAlertList';
import { LoaderContext } from '../common/context/LoaderContextProvider';
import authService from '../common/services/AuthService';
import { isEmpty } from 'lodash';
import { useHistory } from 'react-router-dom';

const { REACT_APP_TEST_EMAIL, REACT_APP_TEST_PASSWORD } = process.env;

const LoginPage: FC = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showDisclaimer, setDisclaimer] = useState(true);
	const [errors, setErrors] = useState<string[]>([]);
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
		<Row className="justify-content-center mt-5 pb-5">
			<Col lg="3" md="5">
				<ErrorAlertList errors={errors} />
				<Form onSubmit={handleLogin}>
					<h3 className="py-3">
						<strong>Login</strong>
					</h3>
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
							<div className="d-flex justify-content-end">
								<Button
									onClick={loginAsTestAdmin}
									variant="outline-warning"
									className="text-dark"
									size="sm"
								>
									Login as test Project Manager
								</Button>
							</div>
						</Alert>
					)}
					<Form.Group className="mb-3" controlId="formBasicEmail">
						<Form.Label>Email address</Form.Label>
						<Form.Control
							name="email"
							value={email}
							onChange={({ target: { value } }) => setEmail(value)}
							type="email"
							placeholder="Enter email"
						/>
					</Form.Group>
					<Form.Group className="mb-3" controlId="formBasicPassword">
						<Form.Label>Password</Form.Label>
						<Form.Control
							name="password"
							value={password}
							onChange={({ target: { value } }) => setPassword(value)}
							type="password"
							placeholder="Password"
						/>
					</Form.Group>
					<Button variant="primary" type="submit">
						Login
					</Button>
					<Button onClick={redirectToRegisterPage} variant="outline-primary" className="float-end">
						Register
					</Button>
				</Form>
			</Col>
		</Row>
	);
};

export default LoginPage;
