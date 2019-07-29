const registryFactory = require("../registry");
const _ = require("lodash");
const suggestion = require("../suggestion");

const queuePromise = require("queue-promised");
const promiseWrapper = queuePromise.wrapper;

const check = {
	total: 0,
	left: 0,
	massCheck: (mails) => {
		return new Promise((resolve, reject) => {
			const registry = registryFactory();

			mails.forEach((mail) => {
				const domain = mail.split("@")[1];

				const domainChecker = registry.addDomain(domain);

				if(!mail) {
					return;
				}

				domainChecker.addEmail(mail);
			});

			const domains = registry.getDomains();

			check.total += Object.values(domains).length;
			check.left += Object.values(domains).length;

			const checks = Object.values(domains).map(promiseWrapper(domain => {
				return Promise.race([domain.checkDomain().then((data) => {
					--check.left; return data;
				}), new Promise(resolve => {
					setTimeout(() => {
						domain.getValid().forEach(mail => {
							domain.fail(mail.email, "Timeout");
						});

						resolve(domain._emails);
					}, 60000);
				})
			])}, 20));

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

