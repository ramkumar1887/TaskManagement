import React, { useState } from 'react'
import Nav from './navBoard';
import Content from './Content';

const Main = () => {

  const [currentPage, setCurrentPage] = useState('Dashboard');
  const onSelectPage = (page) => {
    setCurrentPage(page);
};

  return (
    <div className='main'>
        <Nav onSelectPage={onSelectPage}/>
        <Content currentPage={currentPage} /> 
    </div>
  )
}

export default Main