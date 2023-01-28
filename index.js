const _ = require('lodash');
const fetch = require('node-fetch');
const daddy = require('./daddy');

const updateNames = process.env.DOMAIN_NAMES.replace(' ', '').split(',');
const domain = process.env.DOMAIN;

function getCurrentIp() {
  return fetch('https://ifconfig.co/json')
    .then(function (response) {
      return response.json();
    })
    .then((res) => res.ip)
    .catch(function (error) {
      console.error(`${Date()} Fetch Error: `, error);
    });
}

function getDomainsRecords(domain) {
  return daddy.getRecords(domain).then(function (result) {
    return result.body.map((entry) => {
      const { name, data: ip } = entry;
      return { name, ip };
    });
  });
}

async function getWhatNamesToUpdateForDomain(names, domain) {
  const fetchers = [getCurrentIp(), getDomainsRecords(domain)];

  return Promise.all(fetchers).then(function ([currentIp, domainrecords]) {
    console.log(`${Date()} ===> Current IP: `, currentIp);

    return names.reduce((results, name) => {
      const entry = _.filter(domainrecords, { name })[0];
      const ip = _.get(entry, 'ip');

      if (ip !== currentIp) {
        results.push({ name, ip: currentIp });
      }

      return results;
    }, []);
  });
}

async function updateDNSNamesForDomain(names, domain) {
  const whatToUpdate = await getWhatNamesToUpdateForDomain(names, domain);

  if (whatToUpdate.length < 1) {
    console.log(`${Date} Nothing to update`);
    return;
  }

  whatToUpdate.forEach(function (entry) {
    const { name, ip } = entry;
    console.log(`${Date()} updating: `, { domain, name, ip });
    daddy.updateRecord(domain, name, ip).catch(function (error) {
      console.error(`${Date()} Update Error: `, error);
    });
  });
}

updateDNSNamesForDomain(updateNames, domain);
