'use strict';
var _ = require('lodash');
var fs = require('fs');

var INET = 'inet';
var BCAST = 'Bcast';

module.exports = function (cp) {
  function interfaces (f, options = {interfaces: {file: '/etc/network/interfaces', parse: false}, gateway: {resolveHostNames: false}}) {
    
    // @todo add command timeout
    cp.exec('ifconfig', function (err, ifConfigOut, stderr) {
      if (err) {
        return f(err);
      }

      if (stderr) {
        return f(stderr);
      }

      const routeCommand = options.gateway !== undefined && options.gateway.resolveHostNames ? 'route' : 'route -n';
      cp.exec(routeCommand, function (err, routeOut, stderr) {
        if (err) {
          return f(err);
        }

        if (stderr) {
          return f(stderr);
        }
        
        if (options.interfaces.parse) {
          fs.readFile(options.interfaces.file, {encoding: 'utf-8'}, (err, content) => {
            if(err) {
              return f(err);
            }
            
            f(null, parse(ifConfigOut, routeOut, content));
          });    
          return;
        }
        
        f(null, parse(ifConfigOut, routeOut));
      });
    });
  };
  
  return interfaces;
};

function parse(ifConfigOut, routeOut, interfacesContent) {
  return ifConfigOut.trim().split('\n\n').map(function (inface) {
    var lines = inface.split('\n');

    /**
     * Format 1
     * link xx:xx HWaddr xx-xx-xx
     * link xx:xx HWaddr xx:xx:xx
     *
     * Format 1
     * inet xx:xxx.xxx.xxx.xxx mask|masque|...:xxx.xxx.xxx.xxx
     */

    var result = {
      name: getInterfaceName(_.first(lines)),
      ip: getInterfaceIpAddr(lines[1]),
      netmask: getInterfaceNetmaskAddr(lines[1]),
      broadcast: getBroadcastAddr(lines[1]),
      mac: getInterfaceMacAddr(inface),
      gateway: getGateway(routeOut),
    };

    if(interfacesContent) {
      result.dhcp = isDhcp(getInterfaceName(_.first(lines)), interfacesContent)
    }

    return result;
  });
}

function isDhcp(interfaceName, content) {
  if(interfaceName && interfaceName.length > 0) {        
    const re = new RegExp(`iface ${interfaceName}[a-zA-Z0-9 ]* dhcp`,"i")
    return re.test(content);
  }
  return false;
}

function getInterfaceName(firstLine) {
  return _.first(firstLine.split(/ |(: )/));
}

/**
 * extract mac adress
 *
 * ifconfig output:
 *   - link xx:xx HWaddr xx-xx-xx
 *   - link xx:xx HWaddr xx:xx:xx
 *    or
 *   - ether xx:xx:xx:xx:xx:xx  txqueuelen 1000  (Ethernet)
 *
 * @param  {string} firstLine
 * @return {string}           Mac address, format: "xx:xx:xx:xx:xx:xx"
 */
function getInterfaceMacAddr(str) {

  const re = new RegExp(`(?:(?:HWaddr)|(?:ether)) ((?:[0-9a-z]{2}[-:]?){6,})`,"i")
  const match = str.match(re)

  if (!match) return null
  if (match[1].length !== "00:00:00:00:00:00".length) return null
  const mac = match[1]
  return mac

}

/**
 * extract ip addr
 *
 * ifconfig output:
 *   - inet xx:xxx.xxx.xxx.xxx mask|masque|...:xxx.xxx.xxx.xxx
 *
 * @param  {string} line
 * @return {string,null} xxx.xxx.xxx.xxx
 */
function getInterfaceIpAddr(line) {
  if (!_.includes(line, INET)) {
    return null;
  }
  const re = new RegExp(`(?:(?:inet adr\:)|(?:inet addr\:)|(?:inet ))((?:[0-9]{1,3}\.?){4})`)
  const match = line.match(re)

  return match[1].trim()
}

/**
 * extract netmask addr
 *
 * ifconfig output:
 *   - inet xx:xxx.xxx.xxx.xxx mask|masque|...:xxx.xxx.xxx.xxx
 *    or 
 *   - inet xxx.xxx.xxx.xxx netmask xxx.xxx.xxx.xxx
 *
 * @param  {string} line
 * @return {string,null} xxx.xxx.xxx.xxx
 */
function getInterfaceNetmaskAddr(line) {
  if (!_.includes(line, INET)) {
    return null;
  }

  const re = new RegExp(`(?:(?:Masque\:)|(?:Mask\:)|(?:netmask ))((?:[0-9]{1,3}\.?){4})`)
  const match = line.match(re)

  return match[1].trim()
}

/**
 * extract broadcast addr
 * @param  {string} line
 * @return {string,null}      xxx.xxx.xxx.xxx
 */
function getBroadcastAddr(line) {
  if (!line.match( new RegExp(`(${BCAST})|(broadcast)`))) {
    return null;
  }

  const re = new RegExp(`(?:(?:${BCAST}\:)|(?:broadcast ))((?:[0-9]{1,3}\.?){4})`)
  const match = line.match(re)

  return match[1].trim()
}


/**
 * extract gateway ip
 * @param  {string} stdout
 * @return {string,null} default gateway ip or null
 */
function getGateway(stdout) {
  const re = new RegExp(`(?:(?:default)|(?:link-local)) +([^ ]+)`)
  const match = stdout.match(re)
  if (match === null) return null

  const gw = match[1].split(/[-\.]/g).slice(0,4).join(".")

  return gw
}
