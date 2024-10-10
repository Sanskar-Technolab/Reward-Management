import React from 'react';
import { Controller } from 'react-hook-form';


interface ViewModalProps {
    title: string;
    adminFirstNameLabel: string;
    adminLastNameLabel: string;
    adminUsernameLabel: string;
    adminMobileLabel: string;
    adminSetPasswordLabel: string;
    adminEmailLabel: string;
    onClose: () => void;
    onSubmit: () => void;
    onCancel: () => void;
    control: any; // React Hook Form control
    errors: any; // React Hook Form errors
}

const AddAdminModel: React.FC<ViewModalProps> = ({
    title,
    onSubmit,
    onCancel,
    onClose,
    adminFirstNameLabel,
    adminLastNameLabel,
    adminUsernameLabel,
    adminMobileLabel,
    adminSetPasswordLabel,
    adminEmailLabel,
    control,
    errors
}) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
                <div className="flex flex-col h-full max-h-[80vh]">
                    <div className="flex justify-between border-b p-4">
                        <h6 className="text-1rem font-semibold text-primary">{title}</h6>
                        <button onClick={onClose} type="button" className="text-1rem font-semibold text-defaulttextcolor">
                            <span className="sr-only">Close</span>
                            <i className="ri-close-line"></i>
                        </button>
                    </div>
                    <div className="p-4 overflow-auto flex-1">
                        <form onSubmit={onSubmit}>
                            <div className="mb-4">
                                <label htmlFor="adminFirstName" className="form-label text-sm text-defaulttextcolor font-semibold">{adminFirstNameLabel}</label>
                                <Controller
                                    name="firstName"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            type="text"
                                            className="form-control w-full rounded-[5px] border border-[#dadada] form-control-light mt-2 text-sm"
                                            placeholder="Enter first name"
                                            id="adminFirstName"
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="adminLastName" className="form-label text-sm text-defaulttextcolor font-semibold">{adminLastNameLabel}</label>
                                <Controller
                                    name="lastName"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            type="text"
                                            className="form-control w-full rounded-[5px] border border-[#dadada] form-control-light mt-2 text-sm"
                                            placeholder="Enter last name"
                                            id="adminLastName"
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="adminUsername" className="form-label text-sm text-defaulttextcolor font-semibold">{adminUsernameLabel}</label>
                                <Controller
                                    name="username"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            type="text"
                                            className="form-control w-full rounded-[5px] border border-[#dadada] form-control-light mt-2 text-sm"
                                            placeholder="Enter username"
                                            id="adminUsername"
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="adminEmail" className="form-label text-sm text-defaulttextcolor font-semibold">{adminEmailLabel}</label>
                                <Controller
                                    name="email"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            type="email"
                                            className="form-control w-full rounded-[5px] border border-[#dadada] form-control-light mt-2 text-sm"
                                            placeholder="Enter email"
                                            id="adminEmail"
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="adminMobile" className="form-label text-sm text-defaulttextcolor font-semibold">{adminMobileLabel}</label>
                                <Controller
                                    name="mobileNumber"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            type="text"
                                            className="form-control w-full rounded-[5px] border border-[#dadada] form-control-light mt-2 text-sm"
                                            placeholder="Enter mobile number"
                                            id="adminMobile"
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.mobileNumber && <p className="text-red-500 text-xs mt-1">{errors.mobileNumber.message}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="adminPassword" className="form-label text-sm text-defaulttextcolor font-semibold">{adminSetPasswordLabel}</label>
                                <Controller
                                    name="password"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            type="password"
                                            className="form-control w-full rounded-[5px] border border-[#dadada] form-control-light mt-2 text-sm"
                                            placeholder="Enter password"
                                            id="adminPassword"
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                            </div>
                            <div className="border-t border-defaultborder p-4 flex justify-end " >
                                <button
                                    type="submit"
                                    className="ti-btn ti-btn-primary bg-primary me-3 "
                                    onClick = {onSubmit}
                                > 
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={onCancel}
                                    className="bg-defaulttextcolor ti-btn text-white"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddAdminModel;
