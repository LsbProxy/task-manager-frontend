import { each, isEmpty, some } from 'lodash';
import React, { useState, useContext } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import { LoaderContext } from '../../common/context/LoaderContextProvider';
import authService from '../../common/services/AuthService/AuthService';
import ErrorAlertList from '../Errors/ErrorAlertList';

const RegisterPage = () => {
    const [state, setState] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: '',
        password2: '',
        errors: [],
    });
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

    const register = async () => {
        try {
            const { username, password, password2, email, firstName, lastName } = state;

            showLoader(true);

            await authService.register(username, password, password2, email, firstName, lastName);

            window.location.href = '/login';
        } catch (err) {
            showLoader(false);
            handleError(err);
        }
    };

    const validateRegister = () => {
        const { firstName, lastName, email, username, password, password2 } = state;
        const errorList = [];

        if (!firstName) {
            errorList.push('First name is required.');
        }

        if (!lastName) {
            errorList.push('Last name is required.');
        }

        if (!email) {
            errorList.push('Email is required.');
        }

        if (!username) {
            errorList.push('Username is required.');
        }

        if (!password) {
            errorList.push('Password is required.');
        }

        if (!password2) {
            errorList.push('Repeat password is required.');
        } else if (password !== password2) {
            errorList.push('Passwords must match.');
        }

        setState({ ...state, errors: errorList });

        const hasErrors = errorList.length;

        return !!hasErrors;
    };

    const handleRegister = (e) => {
        e.preventDefault();

        if (validateRegister()) {
            return;
        }

        register();
    };

    const handleChange = ({ target: { name, value } }) => setState({ ...state, [name]: value });

    const redirectToLoginPage = (e) => {
        e.stopPropagation();
        history.push('/login');
    };

    const { firstName, lastName, username, email, password, password2, errors } = state;

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
