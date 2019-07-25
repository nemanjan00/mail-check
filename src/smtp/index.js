const smtpClient = require("smtp-client").SMTPClient;

module.exports = (domain) => {
	const smtp = {
		_client: undefined,
		init: (domain) => {
			return new Promise((resolve, reject) => {
				smtp._client = new smtpClient({
					host: domain[0].exchange,
					port: 25
				})
				
				smtp._client.connect().then(() => {
					smtp._client.greet({hostname: domain[0].exchange}).then(() => {
						smtp._client.mail({from: 'from@sender.com'}).then(() => {
							resolve(smtp);
						}).catch((error) => {
							reject(error);
						});
					}).catch((error) => {
						reject(error);
					});
				}).catch((error) => {
					reject(error);
				});
			});
		},
		verifyMail: (mail) => {
			return new Promise((resolve, reject) => {
				smtp._client.rcpt({to: mail}).then((data) => {
					resolve(data);
				}).catch(reject);
			});
		},
		checkAcceptAll: (domain) => {
			return new Promise((resolve) => {
				smtp._client.rcpt({to: "sdfsfsfdsd@" + domain}).then(() => {
					resolve(true);
				}).catch(() => {
					resolve(false);
				});
			});
		},
		end: () => {
			return new Promise((resolve, reject) => {
				smtp._client.quit().then(resolve).catch(reject);
			});
		}
	};

	return smtp.init(domain);
};

