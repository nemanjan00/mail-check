const registry = require("../registry");

module.exports = {
	massCheck: (mails) => {
		return new Promise((resolve, reject) => {
			mails.forEach((mail) => {
				const domain = mail.split("@")[1];

				const domainChecker = registry.addDomain(domain);

				domainChecker.addEmail(mail);
			});

			const domains = registry.getDomains();

			const checks = Object.values(domains).map(domain => domain.checkDomain());

			Promise.all(checks).then(() => {
				Object.values(domains).forEach(domain => {
					console.log(domain.serialize());
				});
			});
		});
	}
};

