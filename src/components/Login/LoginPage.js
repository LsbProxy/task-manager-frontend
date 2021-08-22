import { each, isEmpty, some } from 'lodash';
import React, { useState, useContext } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import { LoaderContext } from '../../common/context/LoaderContextProvider';
import authService from '../../common/services/AuthService/AuthService';
import ErrorAlertList from '../Errors/ErrorAlertList';

const LoginPage = () => {
    const [state, setState] = useState({ email: '', password: '', errors: [] });
    const { showLoader } = useContext(LoaderContext);
    const history = useHistory();

    const handleError = (err) => {
        if (err && !isEmpty(err.error)) {
            setState((newState) => {
                const errors = [...newState.errors];

                each(err.error, (error) => {
                    if (!some(newState.errors, (msg) => msg === error)) {
                        errors.push(error);
                    }
                });

                return { ...newState, errors };
            });
        }
    };

    const login = async () => {
        try {
            const { email, password } = state;

            showLoader(true);

            const user = await authService.login(email, password);

            window.localStorage.setItem('user', JSON.stringify(user));
            window.location.href = '';
        } catch (err) {
            showLoader(false);
            handleError(err);
        }
    };

    const validateLogin = () => {
        const { email, password } = state;
        const errorList = [];

        if (!email) {
            errorList.push('Email');
        }

        if (!password) {
            errorList.push('Password');
        }

        setState({ ...state, errors: errorList });

        const hasErrors = errorList.length;

        return !!hasErrors;
    };

    const handleLogin = (e) => {
        e.preventDefault();

        if (validateLogin()) {
            return;
        }

        login();
    };

    const handleChange = ({ target: { name, value } }) => setState({ ...state, [name]: value });

    const redirectToRegisterPage = (e) => {
        e.stopPropagation();
        history.push('/register');
    };

    return (
        <Row className="justify-content-center mt-5 pb-5">
            <Col lg="3" md="5">
                <ErrorAlertList errors={state.errors} />
                <Form onSubmit={handleLogin}>
                    <h3 className="py-3">
                        <strong>Login</strong>
                    </h3>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            name="email"
                            value={state.email}
                            onChange={handleChange}
                            type="email"
                            placeholder="Enter email"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            name="password"
                            value={state.password}
                            onChange={handleChange}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Login
                    </Button>
                    <Button
                        onClick={redirectToRegisterPage}
                        variant="outline-primary"
                        className="float-end"
                    >
                        Register
                    </Button>
                </Form>
            </Col>
        </Row>
    );
};

export default LoginPage;
