import React from 'react'

const TaskForm = () => {
  return (
    <div className='form-overlay'>
        <div className='task-form'>
            <div className='task-form-header'>

                <h1>Add Task</h1>

                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="cross-icon">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>

            </div>
        </div>
    </div>
  )
}

export default TaskForm