// Installing modules
const fs = require('fs');
const express = require('express');
const hbs = require('hbs');

var app = express();

// Setting HandleBars Partials local directory
hbs.registerPartials(__dirname + '/views/partials');

// Setting Express view engine as HandleBars
app.set('view-engine', 'hbs');

// Using middleware logger to request http method and full date on the server using the req object and then printing to external file, if it fails next middleware won't run.
// The server, through the routing handler where the same req object is passed as argument will contain the data requested.
app.use((req, res, next) => {
	var ora = new Date().toString();
	var log = `${ora}: ${req.method} ${req.url}`;
	console.log(log);
	fs.appendFile('server.log', log + '\n', (err) => {
	  if (err) {
	    console.log('Impossibile scrivere dati sul file server.log');
	  }
	});
	next();
});

// Maintenance Page:
// not using .next() after res.render() won't let next middleware to run 
//app.use((req, res, next) => {
//	res.render('manutenzione.hbs');
// });



// using HandleBars Partial .registerHelper() to register a method for use inside the application
hbs.registerHelper('CalcolaAnno', () => {
	return new Date().getFullYear();
});

// Creating another Partial
hbs.registerHelper('UrlaLo', (testo) => {
	return testo.toUpperCase();
})

// Creating static page
app.use(express.static(__dirname + '/public'));

// Creating routing handlers
app.get('/', (req, res) => {
	//res.send('<h1>Hello Express!</h1>');
	// res.send({
	// 	nome: 'Francesco',
	// 	hobby: ['guitar', 'cinema']
	// })
	res.render('home.hbs', {
		titoloPagina: 'Home Page',
		testo: 'Benvenuti nel sito!',
		annoCorrente: new Date().getFullYear()
	})
});

app.get('/about', (req, res) => {
	//res.send('About Page');
	
	res.render('about.hbs', {
		titoloPagina: 'About Page',
		annoCorrente: new Date().getFullYear()
	});

});


app.get('/bad', (req, res) => {
	res.send({
		errorMessage: 'Impossibile rispondere alla richiesta req'
	})
});

// Starting server on localhost:3000
app.listen(3000, () => {
	console.log('WebServer attivo su porta 3000');
});
