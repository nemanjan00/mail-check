const smtp = require("../smtp");
const validator = require("validator");
const dns = require("../dns");

const promiseMap = (promise) => {
	return new Promise((resolve, reject) => {
		promise.then(data => {
			resolve({
				status: "resolved",
				data
			});
		}).catch((data) => {
			resolve({
				status: "rejected",
				data
			});
		});
	});
}

module.exports = (mailDomain) => {
	const domain = {
		_emails: {},
		addEmail: (email) => {
			if(typeof email === 'string' || email instanceof String) {
				email = {email};
			}

			email.email = email.email.toLowerCase();

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
			return Object.values(domain._emails).filter((email) => {
				return !email.invalid;
			});
		},
		checkDomain: () => {
			return new Promise((resolve) => {
				console.log("-------------------------------");
				console.log("Checking: " + mailDomain);

				Object.values(domain._emails).forEach((email) => {
					if(!validator.isEmail(email.email)) {
						domain.fail(email.email, "Invalid email");
					}
				});

				if(domain.getValid().length == 0) {
					resolve();
				}

				dns.getMx(mailDomain).then((mx) => {
					smtp(mx).then((smtpClient) => {
						const validEmails = domain.getValid();

						smtpClient.checkAcceptAll(mailDomain).then((accepts) => {
							if(!accepts) {
								const promises = validEmails.map(email => {
									return smtpClient.verifyMail(email.email);
								});
								
								Promise.all(promises.map(promiseMap)).then((checks) => {
									checks.forEach((value, key) => {
										if(value.status == "rejected") {
											domain.fail(validEmails[key].email, "Email does not exist");
										}
									});

									smtpClient.end().then(() => {
										resolve();
									});
								});

								return;
							}

							domain.failAll("Server accepting all mails");

							resolve();
						});
					}).catch((error) => {
						if(error) {
							console.error((error || {message: null} ).message);
						}

						domain.failAll("Unable to connect to SMTP server");

						resolve();
					});
				}).catch((error) => {
						console.error((error || {message: null} ).message);

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

