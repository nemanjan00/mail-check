const check = require("./src/check");

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
