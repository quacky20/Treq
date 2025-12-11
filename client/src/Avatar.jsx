function Avatar({ username, userID, online }) {
    const colors = ['bg-red-200', 'bg-blue-200', 'bg-green-200', 'bg-purple-200', 'bg-yellow-200', 'bg-teal-200', 'bg-zinc-200']

    const userIDbase10 = parseInt(userID, 16)
    const colorIndex = userIDbase10 % colors.length
    const color = colors[colorIndex] || 'bg-gray-200'
    const firstLetter = username?.[0]?.toUpperCase() || '?'

    return (
        <div className={`w-8 h-8 ${color} rounded-full flex items-center justify-center relative text-text-dark
        font-bold`}>
            {firstLetter}
            {online && (
                <div className="absolute w-2 h-2 rounded-full bg-emerald-300 bottom-0 right-0 border border-white"></div>
            )}
            {!online && (
                <div className="absolute w-2 h-2 rounded-full bg-gray-300 bottom-0 right-0 border border-white"></div>
            )}
        </div>
    )
}

export default Avatar