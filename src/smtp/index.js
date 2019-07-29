const smtpClient = require("smtp-client").SMTPClient;

const queuePromise = require("queue-promised");
const promiseWrapper = queuePromise.wrapper;

const logger = require("node-color-log");

module.exports = (domain, mailDomain) => {
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

				smtp._client.on("error", smtp._closed);
				smtp._client.on("close", smtp._closed);

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

					smtp._disconnected = false;

					smtp._greet().then(() => {
						clearTimeout(timeout);
						status = "connected";
						resolve(smtp);
					}).catch(() => {
						status = "fail";
					});
				}).catch((error) => {
					logger.error(mailDomain + ":" + (error || {message: null} ).message);
					status = "fail";
				});
			});
		},
		_greet: () => {
			return new Promise((resolve, reject) => {
				if(smtp._disconnected) {
					reject();
				}

				smtp._client.greet({hostname: domain[0].exchange}).then(() => {
					if(smtp._disconnected) {
						reject();
					}

					smtp._client.mail({from: 'noreply@gmail.com'}).then(() => {
						resolve();
					}).catch(reject);
				}).catch(reject);
			});
		},
		_disconnected: true,
		_reconnect: () => {
			return new Promise((resolve, reject) => {
				smtp.init(domain).then(resolve).catch(reject);
			});
		},
		_retry: (callback, ...args) => {
			return new Promise((resolve, reject) => {
				smtp._reconnect().then(() => {
					callback(...args).then(resolve).catch(reject);
				}).catch(reject);
			});
		},
		_verifyMail: (mail) => {
			if(smtp._disconnected) {
				return smtp._retry(smtp.verifyMail, mail);
			}

			return new Promise((resolve, reject) => {
				smtp._client.rcpt({to: mail}).then((data) => {
					resolve(data);
				}).catch(reject);
			});
		},
		_closed: (data) => {
			smtp._disconnected = true;
			
			if(data) {
				logger.error(mailDomain + ":smtpDisconnect " + data);
			} else {
				logger.error(mailDomain + ":smtpDisconnect");
			}
		},
		checkAcceptAll: (domain) => {
			if(smtp._disconnected) {
				return smtp._retry(smtp.verifyMail, mail);
			}

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
				if(smtp._disconnected) {
					resolve();
				}

				smtp._client.removeListener("close", smtp._closed);
				smtp._client.quit().then(resolve).catch(reject);
			});
		}
	};

	return smtp.init(domain);
};

