const superagent = require('superagent');
const baseUrl = 'https://api.godaddy.com/v1';
const key = process.env.GD_KEY;
const secret = process.env.GD_SECRET;
const Authorization = `sso-key ${key}:${secret}`;

/**
 {
    "type": " ", // (string) = ['A', 'AAAA', 'CNAME', 'MX', 'NS', 'SOA', 'SRV', 'TXT']
    "name": " ", // (string), domain
    "data": " ", //(string}, {1...255}
    "priority": 1, // (integer, integer-positive, optional): Record priority (MX and SRV only)
    "ttl": 1, // (integer, integer-positive, optional)
    "service": " ", // (string, optional): Service type (SRV only)
    "protocol": " ", // (string, optional): Service protocol (SRV only)
    "port": 1,  // (integer, (1...65535), optional): Service port (SRV only)
    "weight": 1 //(integer, integer-positive, optional): Record weight (SRV only)
}
 */

function getRecordDecriptor(name, ip) {
  return {
    name,
    type: 'A',
    data: ip,
    ttl: 600,
  };
}

function getEndpoint(path) {
  return `${baseUrl}${path}`;
}

function request(path, data) {
  data = data || {};
  const url = getEndpoint(path);
  const method = (data.method || 'GET').toLowerCase();

  // console.log(`url:${url} method:${method} --> `, superagent[method]);
  const req = superagent[method](url);
  req.set('Authorization', Authorization);
  req.set('Content-Type', 'application/json');

  return new Promise(function (resolve, reject) {
    if (data.body) {
      req.send(data.body);
    }

    req.end(function (error, res) {
      if (error) {
        return reject(error);
      }

      resolve(res);
    });
  });
}

module.exports = {
  addRecord(domain, name, value) {
    const params = {
      method: 'PATCH',
      body: [getRecordDecriptor(name, value)],
    };

    return request(`/domains/${domain}/records`, params);
  },

  updateRecord(domain, name, value) {
    const params = {
      method: 'PUT',
      body: [getRecordDecriptor(name, value)],
    };

    return request(`/domains/${domain}/records/A/${name}`, params);
  },

  getInfo(domain) {
    return request(`/domains/${domain}`);
  },

  getRecords(domain) {
    return request(`/domains/${domain}/records/`);
  },

  getList() {
    return request('/domains');
  },
};
