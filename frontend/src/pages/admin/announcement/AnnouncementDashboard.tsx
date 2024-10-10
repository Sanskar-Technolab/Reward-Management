import '../../../assets/css/style.css';
import '../../../assets/css/pages/admindashboard.css';
import Pageheader from '../../../components/common/pageheader/pageheader';
import TableComponent from '../../../components/ui/tables/tablecompnent';
import TableBoxComponent from '../../../components/ui/tables/tableboxheader';
import ViewModalComponent from '../../../components/ui/models/ViewModel';
import React, { Fragment, useState } from "react";
import { useFrappeGetDocList } from 'frappe-react-sdk';
import SuccessAlert from '../../../components/ui/alerts/SuccessAlert';
import DangerAlert from '../../../components/ui/alerts/DangerAlert';
interface Announcements {
    name: string,
    title?: string,
    subject: string,
    published_on?: string,
    end_date?: string
}

const AnnouncementDashboard: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
     // Number of items per page
    const [itemsPerPage] = useState(5);
    // State for modal visibility
    const [isModalOpen, setIsModalOpen] = useState(false); 
    // State to track if modal is for add or edit
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add'); 
     // State for selected announcement
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcements | null>(null);
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [date, setDate] = useState('');
    const [endDate, setEndDate] = useState('');
    // State for search query
    const [searchQuery, setSearchQuery] = useState(''); 
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');
    // Track the announcement to delete
    const [announcementToDelete, setAnnouncementToDelete] = useState<Announcements | null>(null); 
    const [fromDate, setFromDate] = useState<Date | null>(null);
    const [toDate, setToDate] = useState<Date | null>(null);

    const { data: announcementsData, mutate: mutateAnnouncements } = useFrappeGetDocList<Announcements>('Announcements', {
        fields: ['name', 'title', 'subject', 'published_on', 'end_date']
    });


    React.useEffect(() => {
        document.title='Announcements'
        if (showSuccessAlert) {
            const timer = setTimeout(() => {
                setShowSuccessAlert(false);
                // window.location.reload();
            }, 3000); 
            return () => clearTimeout(timer); // Cleanup timeout on component unmount
        }
    }, [showSuccessAlert]);

    const totalPages = Math.ceil((announcementsData?.length || 0) / itemsPerPage);

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
        // Update search query
        setSearchQuery(value); 
        setCurrentPage(1);
        console.log("Search value:", value);
    };


    const handleDateFilter = (from: Date | null, to: Date | null) => {
        setFromDate(from);
        setToDate(to);
        setCurrentPage(1);
    };


    const handleAddProductClick = () => {
        setModalMode('add');
        setQuestion('');
        setAnswer('');
        setDate('');
        setEndDate('');
        setIsModalOpen(true); 
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); 
    };

    const handleSubmit = async () => {
        const data = {
            title: question,
            subject: answer,
            published_on: date,
            end_date: endDate
        };

        try {
            const response = await fetch('/api/resource/Announcements', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const responseData = await response.json(); // Add this line
            if (response.ok) {
                console.log("Announcement added successfully");
                // alert('Announcement added successfully!');
                setAlertTitle('Success');
                setAlertMessage('Announcement added successfully!');
                setShowSuccessAlert(true);
                handleCloseModal();
                mutateAnnouncements(); // Refresh the announcements data
            } else {
                console.error("Failed to add announcement:", responseData); 
            }
        } catch (error) {
            console.error("Error:", error.message || error);
            alert('An error occurred while adding the announcement.');
        }
    };

    const handleEditSubmit = async () => {
        if (!selectedAnnouncement) return;

        const data = {
            title: question,
            subject: answer,
            // Convert date to yyyy-mm-dd
            published_on: formatDateToISO(date), 
            end_date: formatDateToISO(endDate) 
        };

        try {
            const response = await fetch(`/api/resource/Announcements/${selectedAnnouncement.name}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const responseData = await response.json();
            if (response.ok) {
                console.log("Announcement updated successfully");
                // alert('Announcement updated successfully!');
                setAlertTitle('Success');
                setAlertMessage('Announcement updated successfully!');
                setShowSuccessAlert(true);
                handleCloseModal();
                mutateAnnouncements();
            } else {
                console.error("Failed to update announcement:", responseData);
            }
        } catch (error) {
            console.error("Error:", error.message || error);
            alert('An error occurred while updating the announcement.');
        }
    };

    const handleDeleteAnnouncement = (item: Announcements) => {
        setAnnouncementToDelete(item);
        setIsConfirmDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!announcementToDelete) return;

        try {
            const response = await fetch(`/api/resource/Announcements/${announcementToDelete.name}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                 // Add this line
                const responseData = await response.json();
                // Use response data for detailed error
                throw new Error(`Error: ${responseData.message || response.statusText}`); 
            }

            setAlertTitle('Success');
            setAlertMessage('Announcement deleted successfully!');
            setShowSuccessAlert(true);
            setIsConfirmDeleteModalOpen(false);
            mutateAnnouncements();
        } catch (error) {
            console.error('Error deleting announcement:', error.message || error);
            alert('Failed to delete announcement.');
        }
    };

    const cancelDelete = () => {
        setIsConfirmDeleteModalOpen(false);
        setAnnouncementToDelete(null);
    };


    const handleEditAnnouncement = (item: Announcements) => {
        setModalMode('edit');
        setSelectedAnnouncement(item);
        setQuestion(item.title || '');
        setAnswer(item.subject);
        setDate(item.published_on || '');
        setEndDate(item.end_date || '');
        setIsModalOpen(true); 
    };

   

    const formatDateToMySQL = (dateString: string) => {
        const [year, month, day] = dateString.split('-').map(Number);
        return `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;
    };



    const parseDateString = (dateString: string): Date | null => {
        if (typeof dateString !== 'string') {
            console.error("Expected a string, but received:", dateString);
            return null;
        }
        const parts = dateString.split('-');
        if (parts.length !== 3) {
            console.error("Invalid date format:", dateString);
            return null;
        }
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; 
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day);
    };
    
    const formatDateToISO = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (`0${date.getMonth() + 1}`).slice(-2);
        const day = (`0${date.getDate()}`).slice(-2);
        return `${year}-${month}-${day}`;
    };
    


    const formattedAnnouncementsData = announcementsData?.map(announcement => ({
        ...announcement,
        published_on: announcement.published_on ? formatDateToMySQL(announcement.published_on) : '',
        end_date: announcement.end_date ? formatDateToMySQL(announcement.end_date) : '',
    })) || [];


    const filteredData = formattedAnnouncementsData.filter(announcement => {
        const query = searchQuery.toLowerCase();
        
        // Parse the published_on date for filtering
        const announcementDateString = announcement.published_on;
        const isDateValid = typeof announcementDateString === 'string' && announcementDateString.trim() !== '';
        const announcementDate = isDateValid ? parseDateString(announcementDateString) : null;

        const endDateString = announcement.end_date;
        const isendDateValid = typeof endDateString === 'string' && endDateString.trim() !== '';
        const endDate = isendDateValid ? parseDateString(endDateString) : null ;
        
        // Check if the announcement date is within the selected date range
        const isWithinDateRange = ((!fromDate || (announcementDate && announcementDate >= fromDate)) &&
                                  (!toDate || (announcementDate && announcementDate <= toDate)) || (!fromDate || (endDate && endDate >= fromDate)) &&
                                  (!toDate || (endDate && endDate <= toDate)));
        
        return (
            isWithinDateRange && // Include date range filtering
            (
                (announcement.name && announcement.name.toLowerCase().includes(query)) ||
                (announcement.title && announcement.title.toLowerCase().includes(query)) ||
                (announcement.subject && announcement.subject.toString().toLowerCase().includes(query)) ||
                (announcement.end_date && announcement.end_date.toString().toLowerCase().includes(query))
            )
        );
    });
    


    return (
        <Fragment>
            <Pageheader 
                currentpage={"Announcement"} 
                activepage={"/announcement"} 
                
                activepagename='Announcement' 
                
            />
          

            <div className="grid grid-cols-12 gap-x-6 bg-white mt-5 rounded-lg shadow-lg">
                <div className="xl:col-span-12 col-span-12">
                    <div className="box">
                        <TableBoxComponent
                            title="Announcements"
                            onSearch={handleSearch}
                            onAddButtonClick={handleAddProductClick}
                            buttonText="Add Announcement" 
                            showButton={true} 
                            showFromDate={true}
                            showToDate={true}
                            onDateFilter={handleDateFilter}
                        />

                        <div className="box-body m-5">
                            <TableComponent<Announcements>
                                columns={[
                                    { header: 'ID', accessor: 'name' },
                                    { header: 'Title', accessor: 'title' },
                                    {
                                        header: 'Subject',
                                        accessor: 'subject',
                                    },
                                    { header: 'Published On', accessor: 'published_on' },
                                    { header: 'End Date', accessor: 'end_date' },
                                ]}
                                data={filteredData || []}
                                currentPage={currentPage}
                                itemsPerPage={itemsPerPage}
                                handlePrevPage={handlePrevPage}
                                handleNextPage={handleNextPage}
                                handlePageChange={handlePageChange}
                                showProductQR={false}
                                showEdit={true}
                                onEdit={handleEditAnnouncement}
                                showDelete={true}
                                onDelete={handleDeleteAnnouncement}
                                showView={false}
                                editHeader='Action'
                                columnStyles={{
                                    'ID': 'text-[var(--primaries)] font-semibold', 
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Render the modal conditionally */}
            {isModalOpen && (
                <ViewModalComponent
                    title={modalMode === 'add' ? "Add Announcement" : "Edit Announcement"}
                    questionLabel={"Title"}
                    answerLabel={"Subject"}
                    startDateLabel={"Published On"}
                    endDateLabel={"End Date"}
                    showDate={true}
                    showEndDate={true}
                    question={question}
                    answer={answer}
                    date={date}
                    endDate={endDate}
                    setQuestion={setQuestion}
                    setAnswer={setAnswer}
                    setDate={setDate}
                    setEndDate={setEndDate}
                    onClose={handleCloseModal}
                    onSubmit={modalMode === 'add' ? handleSubmit : handleEditSubmit}
                    onCancel={handleCloseModal}
                />
            )}
            {isConfirmDeleteModalOpen && (
                <DangerAlert
                    type="danger"
                    message={`Are you sure you want to delete this announcement?`}
                    onDismiss={cancelDelete}
                    onConfirm={confirmDelete}
                    cancelText="Cancel"
                    confirmText="Continue"
                />
            )}
            {showSuccessAlert && (
                <SuccessAlert
                    title={alertTitle}
                    showButton={false}
                    showCancleButton={false}
                    showCollectButton={false}
                    showAnotherButton={false}
                    showMessagesecond={false}
                    message={alertMessage}
                />
            )}
        </Fragment>
    );
};

export default AnnouncementDashboard;
