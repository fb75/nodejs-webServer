// npm init
// npm install express --save
const fs = require('fs');
const express = require('express');
// includiam handlebars un motore per rendere template in express.js
const hbs = require('hbs');
// instanzio il modulo express
var app = express();

// Per renderizzare templates in più zone del sito uso partial e lo invoco con registerPartials:
// prende  come argomenti :
// I - la directory che si vuol usare per i template partial in uso in handlebar

hbs.registerPartials(__dirname + '/views/partials');

// Lo configuro attraverso .set() passandogli key: value dove key è cosa vogliamo settare e value il valore da assegnare
// creo directory views dove express mantiene i template in uso e ci creo un template con estendsione .hbs per la pagine help.html
app.set('view-engine', 'hbs');

// I middleware che si concatenano fra loro attroverso .next come pterzo parametro dopo req e res che vengono invocati
// dal metodo .use di express permettono di avere gestione del codice in maniere asincrona e sicura
// fra le parti dell'applicazione, impedendo se le cose npn vanno a buon fine di continuare l'esecuzione
// di altro middleware in quanto .next non verrà invocato e l'applicazione si ferma. (esempio la pagina manutenzione che
// mantenuta commentata, impedirebbe l'esecuzione degli altri middleware in quanto al suo interno non viene invocato .next )


// utilizzo alro middleware di express riutilizzando .use al quale passiano una funzione
// che prende come argomenti req res e next.
// Questo perchè possiamo gestire le cose in maniera asincrona e solo dopo aver invocato next() il middleware fa proseguire l'applicazione
app.use((req, res, next) =>{
	// creiamo un logger pre le richieste al server
	// per monitorare quando vengono fatte richieste all'handler del routing stampandone l'orario per lo specifico percorso
	// L'oggetto req che contiene tutte le info relative al client su cui andremo a fare la richiesta, ci darà modo di poterle utilizzare per stamparle a video.
	// req.method ritorna dall'oggetto request il metodo http richiesto e req.url la url
	// Il middleware prende quindi l'oggetto request, fa delle richieste su di lui e solo dopo aver invocato .next() il server attraverso
	// il gestore del routing esguirà il suo codice, .next viene quindi usato per eseguire codice in maniera asincrona come anche
	// leggere dati da un db

	var ora = new Date().toString();

	var log = `${ora}: ${req.method} ${req.url}`;
	console.log(log);

	// scrivo su filesystem col metodo .appendFile che prende 3 parametri:
	// I: il file su cui scrivere
	// II: I dati da scrivere
	// III: callback per gestire gli errori
	fs.appendFile('server.log', log + '\n', (err) => {
		if (err) {
			console.log('Impossibile scrivere dati sul file server.log');
		}
	});
	next();
});

// Creazione Pagina in Manutenzione:
// per stamparla evito di invocare next(); cosicchè rimando a schermo la view manutenzione.hbs
// e tutto il middleware successivo non viene eseguito
//app.use((req, res, next) => {
//	res.render('manutenzione.hbs');
// });



// utilizzo Partials con la funzione Helper per poter riutilizzare dinamicamente funzioni
// prima lo invoco passandogli 2 parametri:
// I: l'helper da utilizzare che chiamo a piacere
// II: funzione da eseguire

hbs.registerHelper('CalcolaAnno', () => {
	return new Date().getFullYear();
});

// creo altro helper per capitalizzare le lettere
// Lo richiamo e posso passargli dopo uno spazio due parametri relativi ai dati da passare {{UrlaLo testo secondoParametro}}
hbs.registerHelper('UrlaLo', (testo) => {
	return testo.toUpperCase();
})

// usiamo middleware di express con la funzione .use che permette di usare il middleware che scegliamo di express.js
// express.static prende il percorso assoluto della cartella che vogliamo servire
// __ dirname è una variabile globale che racchiude il percorso della nostra app e ci aggiungiamo il percorso del nostro file
app.use(express.static(__dirname + '/public'));

// registro un handler per richieste http ( .get((url), funzione da eseguire cioè cosa ritornare a chi ha fatto la richiesta)) )
// la funzione anonima prende sempre 2 parametri:
// req e res
// req racchiude info e dati a proposito della richiesta (es. gli headers, informazioni sul body,)
// res racchiude dei metodi a disposizione per rispondere alla richiesta Http, quali dati rimandare, status http, ecc).

// res.send: express risponde se gli si passa un oggetto, con un oggetto json

// ROUTING -> passo al metodo .get primo parametro con percorso relativo

app.get('/', (req, res) => {
	//res.send('<h1>Ciao Express!</h1>');
	// res.send({
	// 	nome: 'Francesco',
	// 	hobby: ['chitarra', 'JavaScript']
	// })
	res.render('home.hbs', {
		titoloPagina: 'Home Page',
		testo: 'Benvenuti nel sito!',
		annoCorrente: new Date().getFullYear()
	})
});

app.get('/about', (req, res) => {
	//res.send('About Page');

	//utilizziamo .render per passare i template
	// come I par mettiamo la pagina hbs
	// come II par un oggetto con i dati da passare
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




// poi lego l'applicazione ad una porta della macchina locale
app.listen(3000, () => {
	console.log('WebServer attivo su porta 3000');
});
