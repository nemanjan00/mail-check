const mailcheck = require("mailcheck");
const mailDomains = require("../../data/domains.json");

const suggestion = {
	suggest: (mail) => {
		mailcheck.run({
			email: mail,
			domains: mailDomains,
			suggested: function(suggestion) {
				console.log(suggestion);
				// callback code
			},
			empty: function() {
				// callback code
			}
		});
	}
};

module.exports = suggestion;

