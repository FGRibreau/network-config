'use strict';
var fixtures = require('./fixtures');
var path = require('path');
var fs = require('fs');
var t = require('chai').assert;
var INTERFACE_FILE = path.resolve(__dirname, './tmp/interfaces');

describe('ifconfig', function () {
  var ifconfigFactory;

  beforeEach(function () {
    ifconfigFactory = require('../src/ifconfig');
  });

  describe('.configure', function () {
    var ifconfig, os;
    beforeEach(function () {
      os = {
        error: [],
        stdout: [],
        stderr: [],
        cmd: [],
        exec: function (cmd, f) {
          this.cmd.push(cmd);
          f(this.error.shift(), this.stdout.shift(), this.stderr.shift());
        }
      };
      ifconfig = ifconfigFactory(os);
      ifconfig.configure.FILE = INTERFACE_FILE;
    });

    it('should not restart service', function (done) {
      fs.writeFileSync(INTERFACE_FILE, fixtures.interfaces_dhcp, 'utf8');

      ifconfig.configure('eth1', {
        restart: false,
        dhcp: true
      }, function (err) {
        t.strictEqual(err, null);
        t.strictEqual(
          fs.readFileSync(INTERFACE_FILE, 'utf8'),
          fixtures.interfaces_dhcp_out
        );
        t.equal(os.cmd.length, 0)
        done();
      });
    });

    it('should set interface configuration to dhcp', function (done) {
      fs.writeFileSync(INTERFACE_FILE, fixtures.interfaces_dhcp, 'utf8');

      ifconfig.configure('eth1', {
        dhcp: true
      }, function (err) {
        t.strictEqual(err, null);
        t.strictEqual(
          fs.readFileSync(INTERFACE_FILE, 'utf8'),
          fixtures.interfaces_dhcp_out
        );
        t.deepEqual(os.cmd.shift(), 'service networking reload');
        done();
      });
    });

    it('should set interface configuration to ip6 dhcp', function (done) {
      fs.writeFileSync(INTERFACE_FILE, fixtures.interfaces_dhcp, 'utf8');

      ifconfig.configure('eth1', {
        dhcp: true,
        ipv6: true
      }, function (err) {
        t.strictEqual(err, null);
        t.strictEqual(
            fs.readFileSync(INTERFACE_FILE, 'utf8'),
            fixtures.interfaces_dhcp_ip6_out
        );
        t.deepEqual(os.cmd.shift(), 'service networking reload');
        done();
      });
    });

    it('should set interface configuration to ip6 static', function (done) {
      fs.writeFileSync(INTERFACE_FILE, fixtures.interfaces_dhcp, 'utf8');

      ifconfig.configure('eth1', {
        ipv6: true,
        ip6: 'fe80::4639:c4ff:fe54:dbd3',
        prefixlen: 64,
        ip6Gateway: 'fe80::42:c3ff:fe44:4a66'
      }, function (err) {
        t.strictEqual(err, null);
        t.strictEqual(
            fs.readFileSync(INTERFACE_FILE, 'utf8'),
            fixtures.interfaces_ip6_out
        );
        t.deepEqual(os.cmd.shift(), 'service networking reload');
        done();
      });
    });

    it('should rewrite the interface configuration', function (done) {
      fs.writeFileSync(INTERFACE_FILE, fixtures.interfaces_1, 'utf8');

      ifconfig.configure('eth0', {
        ip: '1.1.1.77',
        netmask: '1.1.1.1',
        broadcast: '1.1.1.255',
        gateway: '10.10.10.10'
      }, function (err) {
        t.strictEqual(err, null);
        t.strictEqual(
          fs.readFileSync(INTERFACE_FILE, 'utf8'),
          fixtures.interfaces_1_out
        );
        t.deepEqual(os.cmd.shift(), 'service networking reload');
        done();
      });
    });

    it('should write the network file even if the interface as not present', function (done) {
      fs.writeFileSync(INTERFACE_FILE, fixtures.interfaces_2, 'utf8');

      ifconfig.configure('eth1', {
        ip: '1.1.1.77',
        netmask: '1.1.1.1',
        broadcast: '1.1.1.255',
        gateway: '10.10.10.10'
      }, function (err) {
        t.strictEqual(err, null);
        t.strictEqual(
          fs.readFileSync(INTERFACE_FILE, 'utf8'),
          fixtures.interfaces_2_out
        );
        done();
      });
    });

    it('should write the network file even if the interface as not present', function (done) {
      fs.writeFileSync(INTERFACE_FILE, fixtures.interfaces_3, 'utf8');

      ifconfig.configure('eth1', {
        ip: '1.1.1.77',
        netmask: '1.1.1.1',
        broadcast: '1.1.1.255',
        gateway: '10.10.10.10'
      }, function (err) {
        t.strictEqual(err, null);
        t.strictEqual(
          fs.readFileSync(INTERFACE_FILE, 'utf8'),
          fixtures.interfaces_3_out
        );
        done();
      });
    });
  });
});
