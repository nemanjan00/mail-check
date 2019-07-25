const check = require("./src/check");

check.massCheck([
	"nemanjan00@gmail.com",
	"ne@fsdfsdfsd.fd"
]).then((results) => {
	console.log(results);
});
