'use strict';
var fixtures = require('./fixtures');
var t = require('chai').assert;
var path = require('path');
var INTERFACE_FILE = path.resolve(__dirname, './tmp/interfaces');

describe('ifconfig', function () {
  var ifconfigFactory;

  beforeEach(function () {
    ifconfigFactory = require('../src/ifconfig');
  });

  describe('.interfaces', function () {
    var ifconfig, execMock;
    beforeEach(function () {
      execMock = {
        error: [],
        stdout: [],
        stderr: [],
        cmd: [],
        exec: function (cmd, f) {
          this.cmd.push(cmd);
          f(this.error.shift(), this.stdout.shift(), this.stderr.shift());
        }
      };

      ifconfig = ifconfigFactory(execMock);
      ifconfig.interfaces.FILE = INTERFACE_FILE;
    });

    it('should list interfaces', function (done) {
      execMock.stdout.push(fixtures.ifconfig_get_1);
      execMock.stdout.push(fixtures.route_get_1);

      ifconfig.interfaces(function (err, interfaces) {
        t.strictEqual(err, null);
        t.strictEqual(interfaces.length, 2);
        t.deepEqual(interfaces, [{
          name: 'eth0',
          ip: '1.1.1.77',
          netmask: '1.1.1.0',
          broadcast: '1.1.1.255',
          mac: 'aa:aa:aa:aa:aa:aa',
          gateway: '10.10.10.1',
          dhcp: false
        }, {
          name: 'lo',
          ip: '127.0.0.1',
          netmask: '255.0.0.0',
          broadcast: null,
          mac: null,
          gateway: '10.10.10.1',
          dhcp: false
        }]);
        done();
      });
    });

    it('should list interfaces', function (done) {
      execMock.stdout.push(fixtures.ifconfig_get_2);
      execMock.stdout.push(fixtures.route_get_1);

      ifconfig.interfaces(function (err, interfaces) {
        t.strictEqual(err, null);
        t.strictEqual(interfaces.length, 3);
        t.deepEqual(interfaces, [{
          name: 'eth0',
          ip: '1.1.1.254',
          netmask: '255.255.255.0',
          mac: 'aa:aa:aa:aa:aa:aa',
          gateway: '10.10.10.1',
          broadcast: '1.1.1.255',
          dhcp: false
        }, {
          name: 'lo',
          ip: '127.0.0.1',
          netmask: '255.0.0.0',
          mac: null,
          broadcast: null,
          gateway: '10.10.10.1',
          dhcp: false
        }, {
          name: 'venet0',
          ip: null,
          netmask: null,
          mac: null,
          broadcast: null,
          gateway: '10.10.10.1',
          dhcp: false
        }]);
        done();
      });
    });

    it('should list interfaces', function (done) {
      execMock.stdout.push(fixtures.ifconfig_get_3);
      execMock.stdout.push(fixtures.route_get_2);

      ifconfig.interfaces(function (err, interfaces) {
        t.strictEqual(err, null);
        t.strictEqual(interfaces.length, 3);
        t.deepEqual(interfaces, [{
          name: 'lo',
          ip: '1.1.1.1',
          netmask: '1.1.1.0',
          mac: null,
          broadcast: null,
          gateway: '10.10.10.1',
          dhcp: false
        }, {
          name: 'venet0',
          ip: '1.1.1.2',
          netmask: '1.1.1.255',
          mac: null,
          broadcast: '1.1.1.0',
          gateway: '10.10.10.1',
          dhcp: false
        }, {
          name: 'venet0:0',
          ip: '1.1.1.102',
          netmask: '1.1.1.255',
          mac: null,
          broadcast: '1.1.1.102',
          gateway: '10.10.10.1',
          dhcp: false
        }]);
        done();
      });
    });

    it('should list interfaces', function (done) {
      execMock.stdout.push(fixtures.ifconfig_get_1);
      execMock.stdout.push(fixtures.route_get_3);

      ifconfig.interfaces(function (err, interfaces) {
        t.strictEqual(err, null);
        t.strictEqual(interfaces.length, 2);
        t.deepEqual(interfaces, [{
          name: 'eth0',
          ip: '1.1.1.77',
          netmask: '1.1.1.0',
          broadcast: '1.1.1.255',
          mac: 'aa:aa:aa:aa:aa:aa',
          gateway: '*',
          dhcp: false
        }, {
          name: 'lo',
          ip: '127.0.0.1',
          netmask: '255.0.0.0',
          broadcast: null,
          mac: null,
          gateway: '*',
          dhcp: false
        }]);
        done();
      });
    });

    it('should list interfaces4', function (done) {
      execMock.stdout.push(fixtures.ifconfig_get_4);
      execMock.stdout.push(fixtures.route_get_4);


      ifconfig.interfaces(function (err, interfaces) {
        t.strictEqual(err, null);
        t.strictEqual(interfaces.length, 3);
        t.deepEqual(interfaces, [{
          name: 'enxb827ebf6e3b1',
          ip: '192.168.10.10',
          netmask: '255.255.255.0',
          broadcast: '192.168.10.255',
          mac: 'b8:27:eb:f6:e3:b1',
          gateway: '192.168.10.1',
          dhcp: false
        }, {
          name: 'lo',
          ip: '127.0.0.1',
          netmask: '255.0.0.0',
          broadcast: null,
          mac: null,
          gateway: '192.168.10.1',
          dhcp: false
        }, {
          name: 'rename3',
          ip: null,
          netmask: null,
          broadcast: null,
          mac: "b8:27:eb:f6:e3:b1",
          gateway: '192.168.10.1',
          dhcp: false
        }]);
        done();
      });
    });

    it('should parse the dhcp state correctly from the interfaces file', function (done) {
      execMock.stdout.push(fixtures.ifconfig_get_1);
      execMock.stdout.push(fixtures.route_get_3);
      ifconfig.interfaces.FILE = fixtures.interfaces_dhcp_file;

      ifconfig.interfaces(function (err, interfaces) {
        t.strictEqual(err, null);
        t.strictEqual(interfaces.length, 2);
        t.deepEqual(interfaces, [{
          name: 'eth0',
          ip: '1.1.1.77',
          netmask: '1.1.1.0',
          broadcast: '1.1.1.255',
          mac: 'aa:aa:aa:aa:aa:aa',
          gateway: '*',
          dhcp: true
        }, {
          name: 'lo',
          ip: '127.0.0.1',
          netmask: '255.0.0.0',
          broadcast: null,
          mac: null,
          gateway: '*',
          dhcp: false
        }]);
        done();
      });
    });

    it('should parse the rest of the interfaces even when the interfaces file does not exist', function (done) {
      execMock.stdout.push(fixtures.ifconfig_get_1);
      execMock.stdout.push(fixtures.route_get_3);
      ifconfig.interfaces.FILE = 'path/to/file/that/does/not/exist';

      ifconfig.interfaces(function (err, interfaces) {
        t.strictEqual(err, null);
        t.strictEqual(interfaces.length, 2);
        t.deepEqual(interfaces, [{
          name: 'eth0',
          ip: '1.1.1.77',
          netmask: '1.1.1.0',
          broadcast: '1.1.1.255',
          mac: 'aa:aa:aa:aa:aa:aa',
          gateway: '*',
          dhcp: false
        }, {
          name: 'lo',
          ip: '127.0.0.1',
          netmask: '255.0.0.0',
          broadcast: null,
          mac: null,
          gateway: '*',
          dhcp: false
        }]);
        done();
      });
    });
  });
});
