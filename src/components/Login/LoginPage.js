import { some } from 'lodash';
import React, { useState, useContext } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { LoaderContext } from '../../common/context/LoaderContextProvider';

import authService from '../../common/services/AuthService/AuthService';
import ErrorAlertList from '../Errors/ErrorAlertList';

const LoginPage = () => {
    const [state, setState] = useState({ email: '', password: '', errors: [] });
    const { showLoader } = useContext(LoaderContext);

    const handleError = (err) => {
        if (err && err.error) {
            setState((newState) => {
                if (!some(newState.errors, (msg) => msg === err.error)) {
                    return { ...newState, errors: [...newState.errors, err.error] };
                }

                return newState;
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
            errorList.push('Email is required.');
        }

        if (!password) {
            errorList.push('Password is required.');
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

    return (
        <Row className="padd-top-sml justify-content-center mt-5">
            <Col lg="3" md="5">
                <ErrorAlertList errors={state.errors} />
                <Form onSubmit={handleLogin}>
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
                </Form>
            </Col>
        </Row>
    );
};

export default LoginPage;
