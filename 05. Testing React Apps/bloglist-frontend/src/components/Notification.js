import React from 'react';

const Notification = ({ message, result }) => {
    if (message === null) {
        return null;
    }

    return (
        <div className={result}>
            {message}
        </div>
    );
};

export default Notification;