import React, { useState } from 'react';
import Nav from './navBoard';
import Content from './Content';

const Main = () => {
    const [currentPage, setCurrentPage] = useState('Landing');

    const onSelectPage = (page) => {
        setCurrentPage(page);
    };

    const contentStyle = {
        paddingLeft: currentPage === 'Landing' ? '0px' : '50px',
        transition: 'margin-left 0.3s ease',
        width: '100%',
    };

    return (
        <div className='main'>
            {currentPage !== 'Landing' && currentPage !== 'Login' && currentPage !== 'Signup' && (
                <Nav onSelectPage={onSelectPage} />
            )}
            <div style={contentStyle}>
                <Content currentPage={currentPage} setCurrentPage={setCurrentPage} />
            </div>
        </div>
    );
};

export default Main;
