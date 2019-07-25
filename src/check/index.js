const registry = require("../registry");
const _ = require("lodash");

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
				const result = {};
				Object.values(domains).forEach(domain => {
					_.extend(result, domain.serialize());
				});

				resolve(result);
			});
		});
	}
};

