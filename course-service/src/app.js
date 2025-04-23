const express = require('express');
const bodyParser = require('body-parser');
const courseRoutes = require('./routes/courseRoutes');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

console.log('here')
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/courses', courseRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});