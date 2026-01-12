import React from 'react'

const DataNotFound = () => {
    return (
        <div className='h-full w-full flex flex-1 justify-center items-center '>
            <div className="text-center">
                <h2 className="text-white text-5xl md:text-7xl font-extrabold mb-4 animate-pulse">No results found</h2>
                <p className="text-gray-300 text-lg md:text-2xl max-w-2xl mb-6">{`We could't find what you  searched for.`} <br /> Try Searching again.</p>
            </div>


        </div>
    )
}

export default DataNotFound