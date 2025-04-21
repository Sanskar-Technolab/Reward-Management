import '../../assets/css/style.css';
import '../../assets/css/pages/admindashboard.css';
import Pageheader from '../../components/common/pageheader/pageheader';
import TableComponent from '../../components/ui/tables/tablecompnent'; // Corrected spelling
import TableBoxComponent from '../../components/ui/tables/tableboxheader';
import React, { Fragment, useState, useEffect } from "react";
import axios from 'axios';

interface PointHistoryItem {
    earned_points: number;
    date: string;
    product_name: string;
    product: string;
    product_category: string;
    gift_product_name:string;
    deduct_gift_points:number;
    time : string;

}

// interface Carpenter {
//     city: string;
//     current_points: number;
//     email: string;
//     first_name: string;
//     full_name: string;
//     last_name: string;
//     mobile_number: string;
//     name: string;
//     point_history: PointHistoryItem[];
//     redeem_points: number;
//     total_points: number;
// }

const PointHistory: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Number of items per page
    const [carpenterInfo, setCarpenterInfo] = useState<Partial<Carpenter>>({});

    const [carpenterData, setCarpenterData] = useState<PointHistoryItem[]>([]);
    const [filteredData, setFilteredData] = useState<PointHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [redeemPoints, setRedeemPoints] = useState<number>(0);
    const [totalPoints, setTotalPoints] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        document.title='Point History';

        const fetchUserData = async () => {
            try {
              const response = await axios.get('/api/method/frappe.auth.get_logged_user');
              const loggedInUser = response.data.message; // Get logged-in user name
            //   console.log("Logged in user:", loggedInUser);
        
              if (loggedInUser) {
                await fetchCarpenterData(loggedInUser); // Pass the user to the carpenter data API
              }
            } catch (error) {
              console.error("Error fetching logged user data:", error);
            }
          };
          const fetchCarpenterData = async (loggedInUser: string) => {
            try {
                const response = await axios.get('/api/method/reward_management.api.carpenter_master.get_carpainter_data', {
                    params: { user: loggedInUser },
                });
                // console.log("Carpenter data:", response);

                const data = response.data.message?.carpainter_data[0];
                if (data) {
                    setCarpenterInfo({
                        city: data.city,
                        current_points: data.current_points,
                        email: data.email,
                        full_name: data.full_name,
                        mobile_number: data.mobile_number,
                        total_points: data.total_points,
                        redeem_points: data.redeem_points,
                    });

                    const pointHistory = data.point_history || [];
                    setCarpenterData(pointHistory);
                    setFilteredData(pointHistory);
                } else {
                    setError("No carpenter data found.");
                }

                setLoading(false);
            } catch (error) {
                setError("Error fetching carpenter data.");
                setLoading(false);
            }
        };

        // Show Total points and Redeemed points in card
        const fetchUserPoints = async () => {
            try {
                const response = await axios.get(`/api/method/reward_management.api.carpenter_master.show_total_points`,{
                });
                const { redeem_points, current_points } = response.data.message.message; 
                // console.log("card data", response);
                setRedeemPoints(redeem_points);
                setTotalPoints(current_points);
            } catch (error) {
                console.error("Error fetching user points:", error);
            }
        };

        fetchUserData();
        fetchUserPoints();
    }, []);

    // Filter data based on search query
    useEffect(() => {
        const filtered = carpenterData.filter(item => {
            const query = searchQuery.toLowerCase();
            const matchesSearchQuery =
            (item.product && item.product.toLowerCase().includes(query)) ||
                (item.product_name && item.product_name.toLowerCase().includes(query)) ||
                (item.product_category && item.product_category.toLowerCase().includes(query)) ||
                (item.gift_product_name && item.gift_product_name.toLowerCase().includes(query)) ||
                (item.earned_points && item.earned_points.toString().includes(query)) ||
                (item.time && item.time.toString().includes(query)) ||
                (item.deduct_gift_points && item.deduct_gift_points.toString().includes(query));


        return  matchesSearchQuery;



        }
        );
        setFilteredData(filtered);
    }, [searchQuery, carpenterData]);

    // Table pagination
    const totalPages = Math.ceil((filteredData.length || 0) / itemsPerPage);

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

    // Handle table search
    const handleSearch = (value: string) => {
        setSearchQuery(value); 
        setCurrentPage(1);
        // console.log("Search value:", value);
    };

    const handleAddProductClick = () => {
        console.log("Add Product button clicked");
        // Implement add product logic here
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <Fragment>

           <Pageheader 
                currentpage={"Point History"} 
                activepage={"/point-history"} 
                // mainpage={"/point-history"} 
                activepagename="Point History"
                // mainpagename="Point History"
            />
       
            <div className="grid grid-cols-12 gap-x-6 mt-5">
                <div className="xxl:col-span-12 xl:col-span-12 lg:col-span-12 col-span-12">
                    <div className="grid grid-cols-12 gap-x-6">
                        <div className="xl:col-span-12 col-span-12">
                            <div className="">
                                <div className="">
                                    <div className="grid grid-cols-12 xl:gap-y-0 gap-4">
                                        <div className="category-link xxl:col-span-6 xl:col-span-6 lg:col-span-6 md:col-span-6 sm:col-span-6 col-span-12 p-4 bg-white shadow-lg rounded-lg transition-colors duration-300 hover:bg-purple-50 dark:bg-gray-800 dark:hover:bg-purple-900">
                                            <div className="flex flex-row items-start mb-4">
                                                <span className="avatar avatar-lg bg-black text-white inline-flex items-center justify-center w-12 h-12 rounded-sm mb-2 mr-3">
                                                    <i className="ti ti-wallet text-[1.25rem]"></i>
                                                </span>
                                                <div className="flex flex-col items-start">
                                                    <h5 className="text-[1.125rem] font-semibold mb-2" id='totalgeneratedPoint'>{totalPoints}</h5>
                                                    <div className="flex flex-row text-[1rem] text-[#8c9097] dark:text-white/50">
                                                        <div>Available Points</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="category-link xxl:col-span-6 xl:col-span-6 lg:col-span-6 md:col-span-6 sm:col-span-6 col-span-12 p-4 bg-white shadow-lg rounded-lg transition-colors duration-300 hover:bg-purple-50 dark:bg-gray-800 dark:hover:bg-purple-900">
                                            <div className="flex flex-row items-start mb-4">
                                                <span className="avatar avatar-lg bg-black text-white inline-flex items-center justify-center w-12 h-12 rounded-sm mb-2 mr-3">
                                                    <i className="ti ti-wallet text-[1.25rem]"></i>
                                                </span>
                                                <div className="flex flex-col items-start">
                                                    <h5 className="text-[1.125rem] font-semibold mb-2" id='totalscannedPoints'>{redeemPoints}</h5>
                                                    <div className="flex flex-row text-[1rem] text-[#8c9097] dark:text-white/50">
                                                        <div>Points Redeemed</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-x-6 bg-white mt-5 rounded-lg shadow-lg">
                <div className="xl:col-span-12 col-span-12">
                    <div className="box">
                        <TableBoxComponent 
                            title="Point History" 
                            onSearch={handleSearch} 
                            onAddButtonClick={handleAddProductClick} 
                            buttonText="Add Announcement" // Custom button text
                            showButton={false} // Hide the button
                        />

                        <div className="box-body m-5">
                            <TableComponent<PointHistoryItem>
                                 columns={[
                                    { header: 'Product Name', accessor: 'product_name' },
                                    { header: 'Product Category', accessor: 'product_category' },
                                    { header: 'Earned Points', accessor: 'earned_points' },
                                    { header: 'Date', accessor: 'date' },
                                    { header: 'Time', accessor: 'time' },
                                    { header: 'Gift Name', accessor: 'gift_product_name' },
                                    { header: 'Deduct Points', accessor: 'deduct_gift_points' },
                                ]}
                                data={filteredData}
                                currentPage={currentPage}
                                itemsPerPage={itemsPerPage}
                                handlePrevPage={handlePrevPage}
                                handleNextPage={handleNextPage}
                                handlePageChange={handlePageChange}
                                showProductQR={false}
                                showEdit={false}
                                showDelete={false}
                                editHeader='Action'
                                columnStyles={{
                                    'Total Points': 'text-[var(--primaries)] font-semibold',
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default PointHistory;
