import React from 'react'

const Tasks = () => {
  return (
    <div className='page-container'>

      <h1 className='page-title'>Tasks</h1>

      <p className='page-description'>
      Organize and track tasks efficiently prioritizing deadlines and progress for seamless task management.
      </p>

      <div className='task-container'>

        <div className='task-list'>
          <div className='list-header'>
            <h1>To-Do</h1>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="plus-icon">
  <           path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        <div className='task-list'>
          <div className='list-header'>
            <h1>Ongoing</h1>
          </div>
        </div>

        <div className='task-list'>
          <div className='list-header'>
            <h1>Completed</h1>
          </div>
        </div>

      </div>

    </div>
  )
}

export default Tasks