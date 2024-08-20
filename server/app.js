const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'dist')));
const imageConstant = 'C:/Gopal Sharma-Official/Software/Sportz_Ineractive';
app.use('/images', express.static(path.join(imageConstant, 'images')));

app.use(express.json());
const userRoutes = require('./middleware/router');
app.use('/', userRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
