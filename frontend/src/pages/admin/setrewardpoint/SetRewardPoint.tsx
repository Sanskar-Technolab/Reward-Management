import '../../../assets/css/style.css';
import '../../../assets/css/pages/admindashboard.css';
import Pageheader from '../../../components/common/pageheader/pageheader';
import React, { Fragment, useState, useEffect } from "react";
import axios from 'axios';
import SuccessAlert from '../../../components/ui/alerts/SuccessAlert';

const SetRewardPointsDashboard: React.FC = () => {
    const [minPoints, setMinPoints] = useState<number | ''>('');
    const [maxPoints, setMaxPoints] = useState<number | ''>('');
    const [currentMinPoints, setCurrentMinPoints] = useState<number | ''>('');
    const [currentMaxPoints, setCurrentMaxPoints] = useState<number | ''>('');
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    useEffect(() => {
        document.title='Set Reward Points';
        if (showSuccessAlert) {
            const timer = setTimeout(() => {
                setShowSuccessAlert(false);
                window.location.reload(); // Reload the page after hiding the alert
            }, 3000); // Hide alert after 3 seconds
            return () => clearTimeout(timer);
        }
        // Fetch API function
        const fetchAPI = async () => {
            try {
                const response = await axios.get(`/api/method/reward_management.api.points_setup.get_redeem_points`);

                // Check if the API returns data
                if (response.data.message) {
                    console.log("data", response);
                    const data = response.data.message; // Assuming the response is an array and we need the first item
                    setCurrentMinPoints(data.minimum_points);
                    setCurrentMaxPoints(data.maximum_points);
                }
            } catch (error) {
                console.log(error);
            }
        }

        // Call the fetch API function
        fetchAPI();
    }, [showSuccessAlert]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Validate the inputs
        if (minPoints === '' || maxPoints === '' || minPoints > maxPoints) {
            alert("Please enter valid points and ensure minimum points are not greater than maximum points.");
            return;
        }

        const data = {
            minimum_points: minPoints,
            maximum_points: maxPoints,
        };

        try {
            const response = await fetch('/api/resource/Redeemption Points Setup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Set the success alert and trigger page reload
            setShowSuccessAlert(true);
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to create Redeemption Points Setup.');
        }
    };

    return (
        <Fragment>
              <Pageheader 
                currentpage={"Set Reward Points"} 
                activepage={"/set-reward-points"} 
                // mainpage={"/set-reward-points"} 
                activepagename="Set Reward Points"
                // mainpagename="Set Reward Points "
            />
            {/* <Pageheader currentpage="Set Reward Points" activepage="Set Reward Points" mainpage="Set Reward Points" /> */}
            <div className="grid grid-cols-12 gap-x-6 p-6">
                <div className="col-span-12 flex justify-center items-center">
                    <div className="xl:col-span-3 col-span-12 bg-white mt-5 rounded-lg shadow-lg p-6">
                        <div className="box">
                            <div className="box-header">
                                <div className="box-title text-center text-[var(--primaries)] text-sm font-semibold">
                                    Set Redeem Points
                                </div>
                            </div>
                            <div className="box-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-12 gap-4">
                                        <div className="xl:col-span-12 col-span-12">
                                            <div className="text-center text-defaulttextcolor text-defaultsize font-medium">
                                                Minimum Points : {currentMinPoints}
                                            </div>
                                            <div className="text-center text-defaulttextcolor text-defaultsize font-medium">
                                                Maximum Points : {currentMaxPoints}
                                            </div>
                                        </div>
                                        <div className="xl:col-span-12 col-span-12">
                                            <input
                                                type="number"
                                                className="form-control w-full !rounded-md !bg-light text-defaulttextcolor text-xs font-medium"
                                                id="setMinPoints"
                                                placeholder="Minimum Points"
                                                value={minPoints}
                                                onChange={(e) => setMinPoints(Number(e.target.value))}
                                            />
                                        </div>
                                        <div className="xl:col-span-12 col-span-12">
                                            <input
                                                type="number"
                                                className="form-control w-full !rounded-md !bg-light text-defaulttextcolor text-xs font-medium"
                                                id="setMaxPoints"
                                                placeholder="Maximum Points"
                                                value={maxPoints}
                                                onChange={(e) => setMaxPoints(Number(e.target.value))}
                                            />
                                        </div>
                                        <div className="xl:col-span-12 col-span-12 text-center">
                                            <button
                                                id='submitpoints'
                                                type="submit"
                                                className="ti-btn ti-btn-primary-full w-full"
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showSuccessAlert && (
                <SuccessAlert
                    showButton={false}
                    showCancleButton={false}
                    showCollectButton={false}
                    showAnotherButton={false}
                    showMessagesecond={false}
                    message="Redeemption Points Setup created successfully!"
                />
            )}
        </Fragment>
    );
};

export default SetRewardPointsDashboard;
