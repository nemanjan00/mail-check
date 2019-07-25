const smtpClient = require("smtp-client").SMTPClient;

console.log(smtpClient);

module.exports = (domain) => {
	const smtp = {
		_client: undefined,
		init: (domain) => {
			return new Promise((resolve, reject) => {
				smtp._client = new SMTPClient({
					host: domain,
					port: 25
				})
			});
		},
		verifyMail: (mail) => {
		},
		checkAcceptAll: () => {
		},
		end: () => {
		}
	};

	return smtp.init(domain);
};

