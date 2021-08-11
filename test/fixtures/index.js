'use strict';
var fs = require('fs');
var path = require('path');

module.exports = {
  ifconfig_get_1: fs.readFileSync(path.resolve(__dirname, './ifconfig_get_1.txt'), 'utf8'),
  ifconfig_get_2: fs.readFileSync(path.resolve(__dirname, './ifconfig_get_2.txt'), 'utf8'),
  ifconfig_get_3: fs.readFileSync(path.resolve(__dirname, './ifconfig_get_3.txt'), 'utf8'),
  ifconfig_get_4: fs.readFileSync(path.resolve(__dirname, './ifconfig_get_4.txt'), 'utf8'),
  ifconfig_get_5: fs.readFileSync(path.resolve(__dirname, './ifconfig_get_5.txt'), 'utf8'),

  interfaces_1: fs.readFileSync(path.resolve(__dirname, './interfaces_1.txt'), 'utf8'),
  interfaces_1_out: fs.readFileSync(path.resolve(__dirname, './interfaces_1_out.txt'), 'utf8'),
  interfaces_2: fs.readFileSync(path.resolve(__dirname, './interfaces_2.txt'), 'utf8'),
  interfaces_2_out: fs.readFileSync(path.resolve(__dirname, './interfaces_2_out.txt'), 'utf8'),
  interfaces_3: fs.readFileSync(path.resolve(__dirname, './interfaces_3.txt'), 'utf8'),
  interfaces_3_out: fs.readFileSync(path.resolve(__dirname, './interfaces_3_out.txt'), 'utf8'),
  interfaces_4: fs.readFileSync(path.resolve(__dirname, './interfaces_4.txt'), 'utf8'),
  interfaces_4_out: fs.readFileSync(path.resolve(__dirname, './interfaces_4_out.txt'), 'utf8'),
  interfaces_ip6: fs.readFileSync(path.resolve(__dirname, './interfaces_ip6.txt'), 'utf8'),
  interfaces_ip6_out: fs.readFileSync(path.resolve(__dirname, './interfaces_ip6_out.txt'), 'utf8'),
  interfaces_ip6_nogateway: fs.readFileSync(path.resolve(__dirname, './interfaces_ip6_nogateway.txt'), 'utf8'),
  interfaces_ip6_nogateway_out: fs.readFileSync(path.resolve(__dirname, './interfaces_ip6_nogateway_out.txt'), 'utf8'),
  interfaces_manual: fs.readFileSync(path.resolve(__dirname, './interfaces_manual.txt'), 'utf8'),
  interfaces_manual_out: fs.readFileSync(path.resolve(__dirname, './interfaces_manual_out.txt'), 'utf8'),
  interfaces_dhcp: fs.readFileSync(path.resolve(__dirname, './interfaces_dhcp.txt'), 'utf8'),
  interfaces_dhcp_out: fs.readFileSync(path.resolve(__dirname, './interfaces_dhcp_out.txt'), 'utf8'),
  interfaces_dhcp_ip6: fs.readFileSync(path.resolve(__dirname, './interfaces_dhcp_ip6.txt'), 'utf8'),
  interfaces_dhcp_ip6_out: fs.readFileSync(path.resolve(__dirname, './interfaces_dhcp_ip6_out.txt'), 'utf8'),
  interfaces_dhcp_file: path.resolve(__dirname, './interfaces_dhcp_file.txt'),

  route_get_1: fs.readFileSync(path.resolve(__dirname, './route_get_1.txt'), 'utf8'),
  route_get_2: fs.readFileSync(path.resolve(__dirname, './route_get_2.txt'), 'utf8'),
  route_get_3: fs.readFileSync(path.resolve(__dirname, './route_get_3.txt'), 'utf8'),
  route_get_4: fs.readFileSync(path.resolve(__dirname, './route_get_4.txt'), 'utf8'),
  route_get_5: fs.readFileSync(path.resolve(__dirname, './route_get_5.txt'), 'utf8'),
  route_get_6: fs.readFileSync(path.resolve(__dirname, './route_get_6.txt'), 'utf8')
};
