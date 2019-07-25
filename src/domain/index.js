const smtp = require("../smtp");
const validator = require("validator");
const dns = require("../dns");

module.exports = (mailDomain) => {
	const domain = {
		_emails: {},
		addEmail: (email) => {
			if(typeof email === 'string' || email instanceof String) {
				email = {email};
			}

			email.invalid = false;

			domain._emails[email.email] = email;
		},
		fail: (mail, message) => {
			const email = domain._emails[mail];

			email.invalid = true;
			email.error = message;
		},
		failAll: (message) => {
			Object.values(domain._emails).forEach((email) => {
				domain.fail(email.email, message);
			});
		},
		getValid: () => {
			return Object.keys(domain._emails).filter((email) => {
				return !email.invalid;
			});
		},
		checkDomain: () => {
			return new Promise((resolve) => {
				let validEmails = undefined;

				dns.getMx(mailDomain).then((mx) => {
					Object.values(domain._emails).forEach((email) => {
						if(!validator.isEmail(email.email)) {
							domain.fail(email.email, "Invalid email");
						}
					});

					smtp(mx).then((smtpClient) => {
						const validEmails = domain.getValid();

						const promises = validEmails.map(email => {
							return smtpClient._verifyMail(email.email);
						});
						
						Promise.all(promises).then(() => {
							smtpClient.end().then(() => {
								resolve();
							});
						});
					}).catch((error) => {
						console.error(error.toString());

						domain.failAll("Unable to connect to SMTP server");

						resolve();
					});
				}).catch((error) => {
					console.error(error);

					domain.failAll("Invalid MX");

					resolve();
				});
			});
		},
		serialize: () => {
			return domain._emails;
		}
	};

	return domain;
};

