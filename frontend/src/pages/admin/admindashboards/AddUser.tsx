import React, { Fragment, useState } from 'react';
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFrappeGetCall, useFrappePostCall } from 'frappe-react-sdk';
import Pageheader from '../../../components/common/pageheader/pageheader';
import TableComponent from '../../../components/ui/tables/tablecompnent';
import TableBoxComponent from '../../../components/ui/tables/tableboxheader';
import AddAdminUser from '../../../components/ui/models/AddAdminModel';
import SuccessAlert from '../../../components/ui/alerts/SuccessAlert';

// Validation Schema
const schema = yup.object().shape({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    username: yup.string().required("Username is required"),
    email: yup.string().email("Invalid email address").required("Email is required"),
    mobileNumber: yup.string().matches(/^\d+$/, "Mobile number must be digits").required("Mobile number is required"),
    password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const AddUserDashboard: React.FC = () => {
    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            firstName: '',
            lastName: '',
            username: '',
            email: '',
            mobileNumber: '',
            password: '',
        }
    });

    const [usersData, setUsersData] = useState<User[]>([]);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Number of items per page
    const [searchQuery, setSearchQuery] = useState(''); // State for search query

    // Fetching admin users
    const { data, error } = useFrappeGetCall<User[]>('reward_management.api.add_admin_user.get_users');

    React.useEffect(() => {
        document.title='Add User';
        if (showSuccessAlert) {
            const timer = setTimeout(() =>{ setShowSuccessAlert(false); // Hide alert after 3 seconds
            window.location.reload(); }, 3000);
            return () => clearTimeout(timer);
        }
        if (data) {
            setUsersData(data.message || []);
        }
        if (error) {
            console.error("Error fetching admin users:", error);
        }
    }, [data, error, showSuccessAlert]);

    const handleAddButtonClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        reset();
    };

    // Submitting new admin user
    const { call: createAdminUser } = useFrappePostCall('reward_management.api.add_admin_user.create_admin_user');

    const onSubmit = async (data: any) => {
        try {
            const response = await createAdminUser({
                first_name: data.firstName,
                last_name: data.lastName,
                email: data.email,
                mobile_number: data.mobileNumber,
                password: data.password
            });
            console.log("User created successfully", response);
            setShowSuccessAlert(true);
            handleCloseModal();
        } catch (error) {
            console.error("Error creating admin user:", error);
        }
    };

    // Filter the data based on search query
    const filteredData = usersData.filter(item => {
        const query = searchQuery.toLowerCase();
        return (
            item.first_name.toLowerCase().includes(query) ||
            item.last_name.toLowerCase().includes(query) ||
            item.username.toLowerCase().includes(query) ||
            item.email.toLowerCase().includes(query) ||
            item.mobile_no.toLowerCase().includes(query)
        );
    });

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1); 
    };

    return (
        <Fragment>
            <Pageheader 
                currentpage={"Add User"} 
                activepage={"/add-user"} 
                
                activepagename='Add User' 
               
            />
           

            <div className="grid grid-cols-12 gap-x-6 bg-white mt-5 rounded-lg shadow-lg">
                <div className="xl:col-span-12 col-span-12">
                    <div className="box">
                        <TableBoxComponent
                            title="User List"
                            onSearch={handleSearch}
                            onAddButtonClick={handleAddButtonClick}
                            buttonText="Add New User"
                            showButton={true}
                        />

                        <div className="box-body m-5">
                            <TableComponent<User>
                                columns={[
                                    { header: 'First Name', accessor: 'first_name' },
                                    { header: 'Last Name', accessor: 'last_name' },
                                    { header: 'User Name', accessor: 'username' },
                                    { header: 'Email', accessor: 'email' },
                                    { header: 'Mobile Number', accessor: 'mobile_no' }
                                ]}
                                data={filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
                                currentPage={currentPage}
                                itemsPerPage={itemsPerPage}
                                handlePrevPage={handlePrevPage}
                                handleNextPage={handleNextPage}
                                handlePageChange={handlePageChange}
                                showProductQR={false}
                                showEdit={false}
                                showDelete={false}
                                showView={false}
                                columnStyles={{}}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <AddAdminUser
                    title="Add New Admin User"
                    adminFirstNameLabel="First Name"
                    adminLastNameLabel="Last Name"
                    adminUsernameLabel="User Name"
                    adminEmailLabel="Email"
                    adminMobileLabel="Mobile Number"
                    adminSetPasswordLabel="Set User Password"
                    onClose={handleCloseModal}
                    onSubmit={handleSubmit(onSubmit)}
                    onCancel={handleCloseModal}
                    control={control}
                    errors={errors}
                />
            )}
            {/* Success Alert */}
            {showSuccessAlert && <SuccessAlert 
            showButton={false}
            message="New Admin User Created Successfully!" />}
        </Fragment>
    );
};

export default AddUserDashboard;
