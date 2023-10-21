const express = require('express');
const app = express();
const PORT = 3000;
const authMiddleware = require('./middleware/JWTVerification');


// Middleware to parse JSON requests
app.use(express.json());


// Basic route to ensure server is working
app.get('/', (req, res) => {
    res.send('Endpoint working!');
});

// importing all endpoints from routes
// all below auth route require token
const authenticationRoutes = require('./routers/authentication');
app.use('/auth', authenticationRoutes);

// all routes chronologically below this are protected by authentication
app.use(authMiddleware);

const postRoutes = require('./routers/post');
app.use('/posts', postRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
