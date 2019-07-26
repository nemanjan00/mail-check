const domainChecker = require("../domain");

module.exports = () => {
	const domains = {};

	const registry = {
		getDomain: (domain) => {
			if(domains[domain] === undefined){
				domains[domain] = domainChecker(domain);
			}

			return domains[domain];
		},
		addDomain: (domain) => {
			return registry.getDomain(domain);
		},
		getDomains: () => {
			return domains;
		},
		clearDomain: (domain) => {
			delete domains[domain];
		}
	};

	return registry;
};

