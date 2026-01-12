import React from 'react'

const ComingSoon = () => {
    return (
        <div className="h-full w-full flex flex-1 justify-center items-center" >
            <div className="text-center">
                <h1 className="text-white text-5xl md:text-7xl font-extrabold mb-4 animate-pulse">
                    Coming Soon
                </h1>

                <p className="text-gray-300 text-lg md:text-2xl max-w-2xl mb-6">
                  {` We're working hard to bring you something amazing. Stay tuned!`}
                </p>
            </div>
        </div>
    )
}

export default ComingSoon