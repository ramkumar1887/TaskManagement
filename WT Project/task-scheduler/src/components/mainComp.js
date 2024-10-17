import React, { useState } from 'react';
import Nav from './navBoard';
import Content from './Content';

const Main = () => {

  const [currentPage, setCurrentPage] = useState('Landing');
  const onSelectPage = (page) => {
    setCurrentPage(page);

};

const contentStyle = {
  marginLeft: currentPage === 'Landing' ? '0px' : '50px', // Conditional margin
  transition: 'margin-left 0.3s ease', // Smooth transition effect
  width: '100%' // Ensure content spans full width
  
};

  return (
    <div className='main'>
        {currentPage !== 'Landing' && <Nav onSelectPage={onSelectPage} />}
        <div style={contentStyle}>
        <Content currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>
    </div>
  )
}

export default Main