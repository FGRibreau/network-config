'use strict';
var _ = require('lodash');

module.exports = function (cp) {
  return {
    interfaces: function (f) {
      cp.exec('ifconfig', function (err, stdout, stderr) {
        if (err) {
          return f(err);
        }

        if (stderr) {
          return f(stderr);
        }

        f(null, parse(stdout));
      });
    }
  };
};


function parse(stdout) {
  return stdout.split('\n\n').map(function (inface) {
    var lines = inface.split('\n');

    /**
     * Format 1
     * link xx:xx HWaddr xx-xx-xx
     * link xx:xx HWaddr xx:xx:xx
     *
     * Format 1
     * inet xx:xxx.xxx.xxx.xxx mask|masque|...:xxx.xxx.xxx.xxx
     */

    return {
      name: getInterfaceName(_.first(lines)),
      ip_address: getInterfaceIpAddr(lines[1]),
      netmask: getInterfaceNetmaskAddr(lines[1]),
      mac_address: getInterfaceMacAddr(_.first(lines))
    };
  });
}

function getInterfaceName(firstLine) {
  return _.first(firstLine.split(' '));
}

/**
 * extract mac adress
 *
 * ifconfig output:
 *   - link xx:xx HWaddr xx-xx-xx
 *   - link xx:xx HWaddr xx:xx:xx
 *
 * @param  {string} firstLine
 * @return {string}           Mac address, format: "xx:xx:xx:xx:xx:xx"
 */
var MAC = 'HWaddr';

function getInterfaceMacAddr(firstLine) {
  if (!_.include(firstLine, MAC)) {
    return null;
  }

  var macAddr = _.last(firstLine.split(MAC)).trim().replace(/-/g, ':');

  if (macAddr.split(':').length !== 6) {
    return null;
  }

  return macAddr;
}

/**
 * extract ip addr
 *
 * ifconfig output:
 *   - inet xx:xxx.xxx.xxx.xxx mask|masque|...:xxx.xxx.xxx.xxx
 *
 * @param  {string} line
 * @return {string} xxx.xxx.xxx.xxx
 */

var INET = 'inet';

function getInterfaceIpAddr(line) {
  if (!_.include(line, INET)) {
    return null;
  }
  return _.first(line.split(':')[1].split(' '));
}

/**
 * extract netmask addr
 *
 * ifconfig output:
 *   - inet xx:xxx.xxx.xxx.xxx mask|masque|...:xxx.xxx.xxx.xxx
 *
 * @param  {string} line
 * @return {string} xxx.xxx.xxx.xxx
 */
function getInterfaceNetmaskAddr(line) {
  if (!_.include(line, INET)) {
    return null;
  }
  return _.last(line.split(':'));
}
