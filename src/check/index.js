const registryFactory = require("../registry");
const _ = require("lodash");
const suggestion = require("../suggestion");

const queuePromise = require("queue-promised");
const promiseWrapper = queuePromise.wrapper;

const check = {
	massCheck: (mails) => {
		return new Promise((resolve, reject) => {
			const registry = registryFactory();

			mails.forEach((mail) => {
				const domain = mail.split("@")[1];

				const domainChecker = registry.addDomain(domain);

				domainChecker.addEmail(mail);
			});

			const domains = registry.getDomains();

			const checks = Object.values(domains).map(promiseWrapper(domain => domain.checkDomain(), 1));

			Promise.all(checks).then(() => {
				const result = {};

				Object.values(domains).forEach(domain => {
					_.extend(result, domain.serialize());
				});

				const suggestions = Object.values(result).filter((email) => {
					return email.invalid;
				}).map((email) => {
					email = _.cloneDeep(email);

					email.email = (suggestion.suggest(email.email) || {full: email.email}).full;

					return email;
				}).filter((email) => {
					return result[email.email] == undefined;
				});

				if(suggestions.length == 0) {
					resolve(result);
					return;
				}

				check.massCheck(suggestions).then((checks) => {
					_.extend(result, checks);

					resolve(result);
				});
			});
		});
	}
};

module.exports = check;

