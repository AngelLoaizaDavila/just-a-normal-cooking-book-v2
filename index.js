const express = require('express');
const app = express();

const router = require('./routes/index');

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Routes
app.use('/api', router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});