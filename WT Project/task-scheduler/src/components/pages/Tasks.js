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
          <h1>To-Do</h1>
          {/* <button><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          </button> */}

        </div>

        <div className='task-list'>
          <h1>Ongoing</h1>
        </div>

        <div className='task-list'>
        <h1>Completed</h1>
        </div>

      </div>

    </div>
  )
}

export default Tasks