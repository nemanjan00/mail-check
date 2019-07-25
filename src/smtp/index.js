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
					resolve(smtp);
				}).catch((error) => {
					reject(error);
				});
			});
		},
		_verifyMail: (mail) => {
			return new Promise((resolve) => {
				resolve(true);
			});
		},
		checkAcceptAll: () => {
			return new Promise((resolve) => {
				resolve(false);
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

