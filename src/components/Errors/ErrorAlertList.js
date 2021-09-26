import React from 'react';
import { get } from 'lodash';
import { Alert } from 'react-bootstrap';

export default function ErrorAlertList({ errors }) {
    return errors.map((err) => {
        const invalid = get(err, 'invalid', false);
        const error =
            typeof err === 'string'
                ? err
                : get(err, 'message') || get(err, 'field') || get(err, 'error');
        const isStandalone = get(err, 'standalone', false) || get(err, 'isApiError', false);

        return (
            <Alert variant="danger" key={error}>
                {!isStandalone && error ? (
                    <>
                        <strong>{error}</strong>
                        {` is ${invalid ? 'invalid' : 'required'}.`}
                    </>
                ) : (
                    <strong>{error || 'Error - Something went wrong'}</strong>
                )}
            </Alert>
        );
    });
}
