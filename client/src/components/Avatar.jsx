function Avatar({ username, userID, online }) {
    const colors = ['bg-red-200', 'bg-blue-200', 'bg-green-200', 'bg-purple-200', 'bg-yellow-200', 'bg-teal-200', 'bg-zinc-200']

    const userIDbase10 = parseInt(userID, 16)
    const colorIndex = userIDbase10 % colors.length
    const color = colors[colorIndex] || 'bg-gray-200'
    const firstLetter = username?.[0]?.toUpperCase() || '?'

    return (
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-text-dark
        font-bold p-px border-2 ` + (online ? 'border-emerald-300' : 'border-gray-300')}>
            <div className={`${color} rounded-full h-full w-full flex items-center justify-center`}>
                {firstLetter}
            </div>
            {/* {online && (
                <div className="absolute w-2 h-2 rounded-full bg-emerald-300 bottom-0 right-0 border border-white"></div>
            )}
            {!online && (
                <div className="absolute w-2 h-2 rounded-full bg-gray-300 bottom-0 right-0 border border-white"></div>
            )} */}
        </div>
    )
}

export default Avatar