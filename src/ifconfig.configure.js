'use strict';
var _ = require('lodash');
var assert = require('assert');
var fs = require('fs');

module.exports = function (cp) {
  /**
   * Configure a network interface
   * @param  {string} name        interface name
   * @param  {object} description interface definition
   * @param  {function} f(err)
   */
  function configure(name, description, f) {
    assert(_.isString(name));
    assert(_.isPlainObject(description));

    fs.readFile(configure.FILE, {
      encoding: 'utf8'
    }, function (err, content) {
      if (err) {
        return f(err);
      }

      fs.writeFile(configure.FILE, replaceInterface(name, content, description), function (err) {
        if (err) {
          return f(err);
        }

        if (typeof description.restart == 'boolean'? description.restart : true) {
          cp.exec('service networking reload', function (err, __, stderr) {
            f(err || stderr || null);
          });
        } else {
          f(null);
        }
      });

    });
  }

  configure.FILE = '/etc/network/interfaces';

  return configure;
};


function replaceInterface(name, content, interfaceDescription) {
  var replaceFn;
  if (interfaceDescription.manual) {
    replaceFn = formatManualConfig;
  } else if (interfaceDescription.ipv6) {
    replaceFn = interfaceDescription.dhcp? formatIp6DhcpConfig : formatIp6Config;
  } else {
    replaceFn = interfaceDescription.dhcp? formatDhcpConfig : formatConfig;
  }
  return excludeInterface(name, content).trim() + '\n\n' + replaceFn(_.extend({
    name: name
  }, interfaceDescription)) + '\n';
}


function excludeInterface(name, content) {
  var without = _.curry(function (name, content) {
    return !_.includes(content, name);
  });

  return _.chain(content)
    .split('\n\n')
    .filter(without(name))
    .join('\n\n').trim();
}

var formatDhcpConfig = _.template(function () {
  /**
auto <%= name %>
iface <%= name %> inet dhcp
*/
}.toString().split('\n').slice(2, -2).join('\n'));

var formatConfig = _.template(function () {
  /**
auto <%= name %>
iface <%= name %> inet static
    address <%= ip %>
    netmask <%= netmask %><%=
(typeof(network) !== "undefined") ? "\n    network "+ network : ""%><%=
(typeof(gateway) !== "undefined") ? "\n    gateway "+ gateway : ""%>
    */
}.toString().split('\n').slice(2, -2).join('\n'));

var formatManualConfig = _.template(function () {
  /**
auto <%= name %>
    iface <%= name %> inet manual
   */
}.toString().split('\n').slice(2, -2).join('\n'));

var formatIp6DhcpConfig = _.template(function () {
  /**
auto <%= name %>
iface <%= name %> inet manual
iface <%= name %> inet6 auto
*/
}.toString().split('\n').slice(2, -2).join('\n'));

var formatIp6Config = _.template(function () {
  /**
auto <%= name %>
iface <%= name %> inet manual
iface <%= name %> inet6 static
    address <%= ip6 %>/<%= ip6prefixlen %><%=
(typeof(ip6Gateway) !== "undefined") ? "\n    gateway "+ ip6Gateway : ""%>
   */
}.toString().split('\n').slice(2, -2).join('\n'));
