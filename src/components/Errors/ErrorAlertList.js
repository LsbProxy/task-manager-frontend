import { isPlainObject } from 'lodash';
import React from 'react';
import { Alert } from 'react-bootstrap';

export default function ErrorAlertList({ errors }) {
    return errors.map((err) => {
        let invalid = false;
        let field = err;

        if (isPlainObject(err)) {
            field = err.field;
            invalid = err.invalid;
        }

        return (
            <Alert variant="danger" key={field}>
                <strong>{field}</strong> is {invalid ? 'invalid' : 'required'}.
            </Alert>
        );
    });
}
