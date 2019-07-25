const smtpClient = require("smtp-client").SMTPClient;

const queuePromise = require("queue-promised");
const promiseWrapper = queuePromise.wrapper;


module.exports = (domain) => {
	const smtp = {
		_pointer: 0,
		_client: undefined,
		init: (domain) => {
			// Limit concurency of this function to 1
			smtp.verifyMail = promiseWrapper(smtp._verifyMail, 1);

			return new Promise((resolve, reject) => {
				if(smtp._pointer == domain.length) {
					reject();
					return;
				}

				smtp._client = new smtpClient({
					host: domain[smtp._pointer].exchange,
					port: 25
				})

				let status = "connecting";

				let timeout = setTimeout(() => {
					if(status == "connecting" || status == "fail") {
						status = "timeout";

						smtp._pointer++;

						smtp.init(domain).then(resolve).catch(reject);
					}
				}, 5000);

				
				smtp._client.connect().then(() => {
					if(status == "timeout") {
						return;
					}

					clearTimeout(timeout);

					status = "connected";

					smtp._client.greet({hostname: domain[0].exchange}).then(() => {
						smtp._client.mail({from: 'from@sender.com'}).then(() => {
							resolve(smtp);
						}).catch(reject);
					}).catch(reject);
				}).catch((error) => {
					console.error(error);
					status = "fail";
				});
			});
		},
		_verifyMail: (mail) => {
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

