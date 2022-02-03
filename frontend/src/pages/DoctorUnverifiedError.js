import React from 'react';

const DoctorUnverifiedError = () => {
    return (
        <div className="bg-red-200 border-red-600 text-red-600 border-l-4 p-4" role="alert">
            <p className="font-bold">
                Your account is unverified.
            </p>
            <p>
                Please submit your details for verification or await admin verification.
            </p>
        </div>

    );
};

export default DoctorUnverifiedError;