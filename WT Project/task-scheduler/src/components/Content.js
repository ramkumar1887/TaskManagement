// Content.js
import React from 'react';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Calendar from './pages/Calendar';
import Teams from './pages/Teams';
import Settings from './pages/Settings';
import Login from './pages/Login';

const Content = ({ currentPage }) => {
    return (
        <div className='content'>
            {currentPage === 'Dashboard' &&  <Dashboard />}
            {currentPage === 'Tasks' && <Tasks />}
            {currentPage === 'Calendar' && <Calendar />}
            {currentPage === 'Teams' && <Teams />}
            {currentPage === 'Settings' && <Settings />}
            {currentPage === 'Login' && <Login />}
        </div>
    );
};

export default Content;
