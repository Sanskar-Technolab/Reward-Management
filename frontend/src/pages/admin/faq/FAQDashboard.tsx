import '../../../assets/css/style.css';
import '../../../assets/css/pages/admindashboard.css';
import Pageheader from '@/components/common/pageheader/pageheader';
import TableComponent from '@/components/ui/tables/tablecompnent';
import TableBoxComponent from '@/components/ui/tables/tableboxheader';
// import ViewModalComponent from '@/components/ui/models/ViewModel';
import React, { Fragment, useState } from "react";
import { useFrappeGetDocList } from 'frappe-react-sdk';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import SuccessAlert from '../../../components/ui/alerts/SuccessAlert';
import DangerAlert from '../../../components/ui/alerts/DangerAlert';


interface FAQ {
    name: string;
    question?: string;
    answer: string;
    status: string;
    created_date?: string;
}

const FAQDashboard: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);
    const [faqData, setFaqData] = useState<FAQ[]>([]);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');
    const [faqToDelete, setFaqToDelete] = useState<FAQ | null>(null);
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
    const [fromDate, setFromDate] = useState<Date | null>(null);
    const [toDate, setToDate] = useState<Date | null>(null);

    const { data } = useFrappeGetDocList<FAQ>('FAQ', {
        fields: ['name', 'question', 'status', 'created_date', 'answer'],
        limit: 0,
        page: currentPage,
        filters: [['status', '=', 'Active']],
        pageSize: itemsPerPage
    });

    React.useEffect(() => {
        document.title="FAQ";
        if (data) {
            setFaqData(data);
        }
        if (showSuccessAlert) {
            const timer = setTimeout(() => {
                setShowSuccessAlert(false);
                window.location.reload();
            }, 3000);
            return () => clearTimeout(timer); 
        }
    }, [data,showSuccessAlert]);

    console.log("faqData", faqData);
    const totalPages = Math.ceil((faqData?.length || 0) / itemsPerPage);

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
        console.log("Search value:", value);
    };
     // date filter---
     const handleDateFilter = (from: Date | null, to: Date | null) => {
        setFromDate(from);
        setToDate(to);
        setCurrentPage(1);
    };



    const handleAddProductClick = () => {
        setModalTitle('Add New FAQ');
        setQuestion('');
        setAnswer('');
        setIsReadOnly(false);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        console.log("Question:", question);
        console.log("Answer:", answer);

        if (!answer || !question) {
            alert("Please enter a valid question and answer.");
            return;
        }

        const data = {
            question,
            answer,
            status: "Active",
            created_date: new Date().toISOString().split('T')[0],
        };

        try {
            let response;
            if (selectedFAQ) {
                // Update existing FAQ
                response = await fetch(`/api/resource/FAQ/${selectedFAQ.name}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
            } else {
                // Add new FAQ
                response = await fetch('/api/resource/FAQ', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
            }

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            setShowSuccessAlert(true);
            setAlertMessage(selectedFAQ ? 'FAQ updated successfully!' : 'FAQ created successfully!');
            setAlertTitle('Success');


            // alert(selectedFAQ ? 'FAQ updated successfully!' : 'FAQ created successfully!');
            setQuestion('');

            setAnswer('');
            handleCloseModal();

        } catch (error) {
            console.error('Error:', error);
            alert('Failed to save FAQ.');
        }
    };

    const handleDeleteFAQ = (item: FAQ) => {
        setFaqToDelete(item);
        setIsConfirmDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (faqToDelete) {
            try {
                const response = await fetch(`/api/resource/FAQ/${faqToDelete.name}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    const responseData = await response.json();
                    throw new Error(`Error: ${responseData.message || response.statusText}`);
                }

                setFaqData(prevData => prevData.filter(faq => faq.name !== faqToDelete.name));
                setAlertTitle('FAQ Deleted');
                setAlertMessage('FAQ deleted successfully!');
                setShowSuccessAlert(true);
            } catch (error) {
                console.error('Error deleting FAQ:', error);
                alert('Failed to delete FAQ.');
            }
        }
        setIsConfirmDeleteModalOpen(false);
        setFaqToDelete(null);
    };

    const cancelDelete = () => {
        setIsConfirmDeleteModalOpen(false);
        setFaqToDelete(null);
    };


    const handleEditFAQ = (item: FAQ) => {
        setSelectedFAQ(item);
        setModalTitle('Edit FAQ');
        setQuestion(item.question || '');
        setAnswer(item.answer || '');
        setIsReadOnly(false);
        setIsModalOpen(true);
    }

    const handleView = (item: FAQ) => {
        setSelectedFAQ(item);
        setModalTitle('View FAQ');
        setQuestion(item.question || '');
        setAnswer(item.answer || '');
        
        setIsReadOnly(true);
        setIsModalOpen(true);
    };

    const sortedFontOptions = [
        "Arial", "Logical", "Salesforce Sans", "Garamond", "Sans-Serif", "Serif",
        "Times New Roman", "Helvetica", "Comic Sans MS", "Courier New", "Impact",
        "Georgia", "Tahoma", "Trebuchet MS", "Verdana"
    ].sort();

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
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
    
    const formattedFAQData = faqData?.map(faq => ({
        ...faq,
        created_date: faq.created_date ? formatDate(faq.created_date) : '',
    })) || [];

    const filteredData = formattedFAQData.filter(faq => {
        const query = searchQuery.toLowerCase();
        
        
        // Parse the created_date for filtering
        const createdDateString = faq.created_date;
        const isDateValid = typeof createdDateString === 'string' && createdDateString.trim() !== '';
        const faqDate = isDateValid ? parseDateString(createdDateString) : null;
    
        // Check if the created_date is within the selected date range
        const isWithinDateRange = (!fromDate || (faqDate && faqDate >= fromDate)) &&
                                  (!toDate || (faqDate && faqDate <= toDate));
    
        // Check for query matches
        const isNameMatch = faq.name && faq.name.toLowerCase().includes(query);
        const isQuestionMatch = faq.question && faq.question.toLowerCase().includes(query);
        const isStatusMatch = faq.status && faq.status.toString().toLowerCase().includes(query);
        
        // Combine conditions
        return isWithinDateRange && (isNameMatch || isQuestionMatch || isStatusMatch);
    });
    return (
        <Fragment>
              <Pageheader 
                currentpage={"FAQ"} 
                activepage={"/frequently-asked-question"} 
                
                activepagename='FAQ' 
               
            />
            {/* <Pageheader currentpage="FAQ" activepage="Faq's" mainpage="Faq's" /> */}
            <div className="grid grid-cols-12 gap-x-6 bg-white mt-5 rounded-lg shadow-lg">
                <div className="xl:col-span-12 col-span-12">
                    <div className="box">
                        <TableBoxComponent
                            title="FAQ"
                            onSearch={handleSearch}
                            onAddButtonClick={handleAddProductClick}
                            buttonText="Add New FAQ"
                            showButton={true}
                            showFromDate={true}
                            showToDate={true}
                            onDateFilter={handleDateFilter}
                        />
                        <div className="box-body m-5">
                            <TableComponent<FAQ>
                                columns={[
                                    { header: 'FAQ ID', accessor: 'name' },
                                    { header: 'Question', accessor: 'question' },
                                    { header: 'Status', accessor: 'status' },
                                    { header: 'Created Date', accessor: 'created_date' },
                                ]}
                                data={filteredData || []}
                                currentPage={currentPage}
                                itemsPerPage={itemsPerPage}
                                handlePrevPage={handlePrevPage}
                                handleNextPage={handleNextPage}
                                handlePageChange={handlePageChange}
                                showProductQR={false}
                                showEdit={true}
                                onEdit={handleEditFAQ}
                                showDelete={true}
                                onDelete={handleDeleteFAQ}
                                showView={true}
                                onView={handleView}
                                editHeader='Update'
                                columnStyles={{
                                    'FAQ ID': 'text-[var(--primaries)] font-semibold',
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
                        <div className="ti-modal-content">
                            <div className="ti-modal-header flex justify-between border-b p-4">
                                <h6 className="modal-title text-1rem font-semibold text-primary">{modalTitle}</h6>
                                <button onClick={handleCloseModal} type="button" className="text-1rem font-semibold text-defaulttextcolor">
                                    <span className="sr-only">Close</span>
                                    <i className="ri-close-line"></i>
                                </button>
                            </div>
                            <div className='p-4'>
                                {isReadOnly && selectedFAQ && (
                                    <div className="xl:col-span-12 col-span-12 mb-4">
                                        <label className="form-label text-sm text-defaulttextcolor font-semibold">FAQ ID</label>
                                        <input
                                            type="text"
                                            className="form-control w-full rounded-5px border border-[#dadada] form-control-light mt-2 text-sm"
                                            value={selectedFAQ.name || ''}
                                            readOnly
                                        />
                                    </div>
                                )}
                                <div className="xl:col-span-12 col-span-12 mb-4">
                                    <label htmlFor="question" className="form-label text-sm text-defaulttextcolor font-semibold">Question</label>
                                    <input
                                        className="form-control w-full rounded-5px border border-[#dadada] form-control-light mt-2 text-sm"
                                        placeholder="Enter your question here"
                                        id="question"

                                        value={question}
                                        onChange={(e) => setQuestion(e.target.value)}
                                        readOnly={isReadOnly}
                                    />
                                </div>
                                <div className="xl:col-span-12 col-span-12 mb-4">
                                    <label htmlFor="answer" className="form-label text-sm text-defaulttextcolor font-semibold">Answer</label>
                                    <SunEditor
                                        setOptions={{
                                            buttonList: [
                                                ["undo", "redo"],
                                                ["font", "fontSize"],
                                                ["removeFormat"],
                                                ["bold", "italic", "underline", "strike"],
                                                ["align", "list", "indent"],
                                                ["fontColor", "hiliteColor"],
                                                ["outdent", "indent"],



                                            ],
                                            font: sortedFontOptions,
                                        }}
                                        setContents={answer}
                                        onChange={setAnswer}
                                        height="200px"
                                        disable={isReadOnly}
                                    />
                                </div>
                                {isReadOnly && selectedFAQ && (
                                    <div className="xl:col-span-12 col-span-12 mb-4">
                                        <label className="form-label text-sm text-defaulttextcolor font-semibold">Created Date</label>
                                        <input
                                            type="text"
                                            className="form-control w-full rounded-5px border border-[#dadada] form-control-light mt-2 text-sm"
                                            value={selectedFAQ.created_date || ""}
                                            readOnly
                                        />
                                    </div>
                                )}
                                {!isReadOnly && (
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            className="ti-btn ti-btn-primary bg-primary me-2"
                                            onClick={handleSubmit}
                                        >
                                            Save
                                        </button>
                                        <button
                                            type="button"
                                            className="bg-defaulttextcolor ti-btn text-white"
                                            onClick={handleCloseModal}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
    {isConfirmDeleteModalOpen && (
                <DangerAlert
                type="danger"
                message="Are you sure you want to delete this FAQ?"
                onDismiss={cancelDelete}
                onConfirm={confirmDelete}
                cancelText="Cancel"
                confirmText="Continue"
            />
            )}
             {showSuccessAlert && (
                <SuccessAlert
                    title={alertTitle}
                    message={alertMessage}
                    showButton={false}
                    onCancel={() => setShowSuccessAlert(false)} onClose={function (): void {
                        throw new Error('Function not implemented.');
                    } }                />
            )}
           
        </Fragment>
    );
};

export default FAQDashboard;
