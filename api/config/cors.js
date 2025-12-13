const allowedOrigins = [
    process.env.CLIENT_URL,
    /\.vercel\.app$/
].filter(Boolean)

const corsOptions = {
    credentials: true,
    origin: function (origin, callback) {
        if (!origin) return callback(null, true)
        if (allowedOrigins.some(allowed =>
            typeof allowed === 'string' ? allowed === origin : allowed.test(origin)
        )) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

module.exports = corsOptions