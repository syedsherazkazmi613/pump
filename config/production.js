module.exports = {
    mongodb_uri: process.env.MONGODB_URI,
    jwt_secret: process.env.JWT_SECRET,
    port: process.env.PORT || 3000,
    node_env: 'production'
}; 