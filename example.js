const check = require("./src/check");

check.massCheck([
	"nemanjan00@gmail.com",
	"ne@fsdfsdfsd.fd",
	"nemanja@flocksocial.io",
	"fsdfsdfsdfkfjdkf@gmail.com",
	"nemanjan00@yahoo.com",
	"me@nemanja.top"
]).then((results) => {
	console.log(results);
});
