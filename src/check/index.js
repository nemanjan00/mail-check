const registry = require("registry");

module.exports = {
	massCheck: (mails) => {
		return new Promise((resolve, reject) => {
			mails.forEach((mail) => {
				const domain = mail.split("@")[1];

				const domainChecker = registry.addDomain(domain);
			});
		});
	}
};

