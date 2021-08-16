import React from 'react';
import { Alert } from 'react-bootstrap';

export default function ErrorAlertList({ errors }) {
    return errors.map((err) => (
        <Alert variant="danger" key={err}>
            {err}
        </Alert>
    ));
}
