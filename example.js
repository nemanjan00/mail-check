const check = require("./src/check");

const term = require( 'terminal-kit' ).terminal;

const progressBar = term.progressBar({
	title: 'Domain checks:',
	percent: true,
	inline: false
});

setInterval(() => {
	progressBar.update(1 - (check.left / check.total));
}, 0);

check.massCheck([
	"nemanjan00@gmail.com",
	"ne@fsdfsdfsd.fd",
	"nemanja@flocksocial.io",
	"fsdfsdfsdfkfjdkf@gmail.com",
	"nemanjan00@yahoo.com",
	"me@nemanja.top",
	"nemanjan00@teknik.io"
]).then((results) => {
	console.log(results);
});
