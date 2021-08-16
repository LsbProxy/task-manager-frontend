import React from 'react';
import { Spinner } from 'react-bootstrap';

export default function Loader() {
    return (
        <Spinner
            animation="border"
            variant="primary"
            style={{
                position: 'absolute',
                top: 'calc(50% - 16px)',
                left: 'calc(50% - 16px)',
            }}
        />
    );
}
