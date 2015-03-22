'use strict';
var fixtures = require('./fixtures');
var t = require('chai').assert;

describe('ifconfig', function () {
  var ifconfigFactory;

  beforeEach(function () {
    ifconfigFactory = require('../src/ifconfig');
  });

  describe('.interfaces', function () {
    var ifconfig, execMock;
    beforeEach('what?', function () {
      execMock = {
        error: null,
        stdout: '',
        stderr: '',
        cmd: null,
        exec: function (cmd, f) {
          this.cmd = cmd;
          f(this.error, this.stdout, this.stderr);
        }
      };

      ifconfig = ifconfigFactory(execMock);
    });

    it('should list interfaces', function (done) {
      execMock.stdout = fixtures.ifconfig_get_1;

      ifconfig.interfaces(function (err, interfaces) {
        t.strictEqual(err, null);
        t.strictEqual(interfaces.length, 2);
        t.deepEqual(interfaces, [{
          name: 'eth0',
          ip_address: '1.1.1.77',
          netmask: '1.1.1.0',
          mac_address: 'aa:aa:aa:aa:aa:aa',
          // gateway_ip: '10.0.1.1'
        }, {
          ip_address: "127.0.0.1",
          mac_address: null,
          name: "lo",
          netmask: "255.0.0.0"
        }]);
        done();
      });
    });

    it('should list interfaces', function (done) {
      execMock.stdout = fixtures.ifconfig_get_2;

      ifconfig.interfaces(function (err, interfaces) {
        t.strictEqual(err, null);
        t.strictEqual(interfaces.length, 3);
        t.deepEqual(interfaces, [{
          "name": "eth0",
          "ip_address": "1.1.1.254",
          "netmask": "255.255.255.0",
          "mac_address": "aa:aa:aa:aa:aa:aa"
        }, {
          "name": "lo",
          "ip_address": "127.0.0.1",
          "netmask": "255.0.0.0",
          "mac_address": null
        }, {
          "name": "venet0",
          "ip_address": null,
          "netmask": null,
          "mac_address": null
        }]);
        done();
      });
    });

    it('should list interfaces', function (done) {
      execMock.stdout = fixtures.ifconfig_get_3;

      ifconfig.interfaces(function (err, interfaces) {
        t.strictEqual(err, null);
        t.strictEqual(interfaces.length, 3);
        t.deepEqual(interfaces, [{
          "name": "lo",
          "ip_address": "1.1.1.1",
          "netmask": "1.1.1.0",
          "mac_address": null
        }, {
          "name": "venet0",
          "ip_address": "1.1.1.2",
          "netmask": "1.1.1.255",
          "mac_address": null
        }, {
          "name": "venet0:0",
          "ip_address": "1.1.1.102",
          "netmask": "1.1.1.255",
          "mac_address": null
        }]);
        done();
      });
    });
  });
});
