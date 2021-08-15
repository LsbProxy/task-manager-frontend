import React, { Component } from 'react';
import { Alert, Button, Col, Form, Row } from 'react-bootstrap';

import authService from '../../common/services/AuthService/AuthService';
import handleError from '../../common/utils/handleError';

class LoginPage extends Component {
    constructor() {
        super();

        this.state = {
            email: '',
            password: '',
            errors: [],
        };

        this.handleError = handleError.bind(this);
    }

    login = async (email, password) => {
        try {
            const user = await authService.login(email, password);
            window.localStorage.setItem('user', JSON.stringify(user));
            window.location.href = '';
        } catch (e) {
            this.handleError(e);
        }
    };

    validateLogin = () => {
        const { email, password } = this.state;
        const errors = [];

        if (!email) {
            errors.push('Email is required.');
        }

        if (!password) {
            errors.push('Password is required.');
        }

        const hasErrors = errors.length > 0;

        this.setState({ errors });
        return !hasErrors;
    };

    handleLogin = async (e) => {
        const { email, password } = this.state;
        const { toggleLoading } = this.props;

        e.preventDefault();

        if (!this.validateLogin()) {
            return;
        }

        toggleLoading(true);
        await this.login(email, password);
        toggleLoading(false);
    };

    handleChange = ({ target: { name, value } }) => this.setState({ [name]: value });

    renderErrors = () => {
        const { errors } = this.state;

        return errors.map((err) => (
            <Alert variant="danger" key={err}>
                {err}
            </Alert>
        ));
    };

    render() {
        const { email, password } = this.state;

        return (
            <Row>
                <Col md={{ span: 4, offset: 4 }}>
                    {this.renderErrors()}
                    <Form onSubmit={this.handleLogin}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                name="email"
                                value={email}
                                onChange={this.handleChange}
                                type="email"
                                placeholder="Enter email"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                name="password"
                                value={password}
                                onChange={this.handleChange}
                                type="password"
                                placeholder="Password"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicCheckbox">
                            <Form.Check type="checkbox" label="Remember me" />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Login
                        </Button>
                    </Form>
                </Col>
            </Row>
        );
    }
}

export default LoginPage;
