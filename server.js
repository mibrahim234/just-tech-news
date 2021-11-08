const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');

const app = express();
const PORT = process.env.PORT || 3001;

const sequelize = require('./config/connection');

const hbs = exphbs.create({});
//require handlebars
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// get files from public folder
app.use(express.static(path.join(__dirname, 'public')));

const routes = require('./controllers/');

// turn on connection to db and server
// method to establish the connection to the database. 
//The "sync" part means that this is Sequelize taking the models and connecting them to associated database tables. 
// If it doesn't find a table, it'll create it for you!
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});




