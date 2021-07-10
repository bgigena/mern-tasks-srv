const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors')

//create server
const app = express();

conectarDB();

app.use(cors());

//habilitar express.json
app.use(express.json({extended:true}));

//app's port
const port = process.env.port || 4000;

//import routes
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));

//start app
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
})