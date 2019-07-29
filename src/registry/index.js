const domainChecker = require("../domain");

module.exports = () => {
	const domains = {};

	const registry = {
		getDomain: (domain) => {
			domain = domain.toLowerCase();

			if(domains[domain] === undefined){
				domains[domain] = domainChecker(domain);
			}

			return domains[domain];
		},
		addDomain: (domain) => {
			domain = domain.toLowerCase();

			return registry.getDomain(domain);
		},
		getDomains: () => {
			return domains;
		},
		clearDomain: (domain) => {
			domain = domain.toLowerCase();

			delete domains[domain];
		}
	};

	return registry;
};

