import React, { useEffect, useState } from 'react';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Calendar from './pages/Calendar';
import Teams from './pages/Teams';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Landing from './pages/Landing';

const Content = ({ currentPage, setCurrentPage }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [visible, setVisible] = useState(false);

    // Effect to check for user login status
    useEffect(() => {
        const user = localStorage.getItem('user');
        setIsLoggedIn(!!user); // Simplified check
    }, []);

    // Effect to handle page change and fade-in effect
    useEffect(() => {
        setVisible(false); // Set visible to false before fade-out
        const timer = setTimeout(() => {
            setVisible(true); // Fade in after a short delay
        }, 7000); // Adjust the delay as needed

        return () => clearTimeout(timer); // Cleanup on unmount
    }, [currentPage]); // Run this effect when currentPage changes

    return (
        <div className='content'>
            {currentPage !== 'Login' && currentPage !== 'Signup' && (
                <div className="page-head">
                    <div className="page-head-title" onClick={() => setCurrentPage('Landing')}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                        <path fillRule="evenodd" d="M18 5.25a2.25 2.25 0 0 0-2.012-2.238A2.25 2.25 0 0 0 13.75 1h-1.5a2.25 2.25 0 0 0-2.238 2.012c-.875.092-1.6.686-1.884 1.488H11A2.5 2.5 0 0 1 13.5 7v7h2.25A2.25 2.25 0 0 0 18 11.75v-6.5ZM12.25 2.5a.75.75 0 0 0-.75.75v.25h3v-.25a.75.75 0 0 0-.75-.75h-1.5Z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M3 6a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H3Zm6.874 4.166a.75.75 0 1 0-1.248-.832l-2.493 3.739-.853-.853a.75.75 0 0 0-1.06 1.06l1.5 1.5a.75.75 0 0 0 1.154-.114l3-4.5Z" clipRule="evenodd" />
                    </svg>
                        <h1>PlanPal</h1>
                    </div>

                    {currentPage === 'Landing' && (
                        <div className='lb-container'>
                            {isLoggedIn ? (
                                <button className='lb' onClick={() => setCurrentPage('Dashboard')}>Go to Dashboard</button>
                            ) : (
                                <>
                                    <button className='lb' onClick={() => setCurrentPage('Login')}>Log In</button>
                                    <button className='lb' onClick={() => setCurrentPage('Signup')}>Sign Up</button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Render the appropriate page based on the currentPage */}
            <div className={`sheet ${visible ? 'visible' : ''}`}>
                {currentPage === 'Landing' && <Landing />}
                {currentPage === 'Dashboard' && <Dashboard />}
                {currentPage === 'Tasks' && <Tasks />}
                {currentPage === 'Calendar' && <Calendar />}
                {currentPage === 'Teams' && <Teams />}
                {currentPage === 'Settings' && <Settings />}
                {currentPage === 'Login' && <Login setCurrentPage={setCurrentPage} />}
                {currentPage === 'Signup' && <Signup setCurrentPage={setCurrentPage} />}
            </div>
        </div>
    );
};

export default Content;
