const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});