const dnscache = require("dnscache");

const dns = {
	dns: dnscache({enable: true, ttl: 300, cachesize: 1000}),
	getMx: (domain) => {
		return new Promise((resolve, reject) => {
			dns.dns.resolveMx(domain, (error, addresses) =>	{
				if(error) {
					return reject(error);
				}

				addresses = addresses.sort((a, b) => a.priority - b.priority);

				return resolve(addresses);
			});
		});
	}
};

module.exports = dns;

