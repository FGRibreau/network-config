# network-config [![Deps](https://david-dm.org/FGRibreau/network-config.png)](https://david-dm.org/FGRibreau/network-config) [![Version](http://badge.fury.io/js/network-config.png)](https://david-dm.org/FGRibreau/network-config) [![Version](https://travis-ci.org/FGRibreau/network-config.svg)](https://travis-ci.org/FGRibreau/network-config) [![Downloads](http://img.shields.io/npm/dm/network-config.svg)](https://www.npmjs.com/package/network-config) [![Slack](https://img.shields.io/badge/Slack-Join%20our%20tech%20community-17202A?logo=slack)](https://join.slack.com/t/fgribreau/shared_invite/zt-edpjwt2t-Zh39mDUMNQ0QOr9qOj~jrg)

Network configuration for NodeJS. **Only used & tested on Debian**

# Setup

```
npm install network-config
```

<p align="center">
<a target="_blank" href="https://play.spotify.com/track/4fZJG8y70r2hyw3Kb4sU4N"><img style="width:100%" src="https://cloud.githubusercontent.com/assets/138050/6771675/9996f128-d0e5-11e4-93b1-6fef5c2c499a.gif"></a>
</p>

# Usage

### List active interfaces

To check the state of dhcp you have to enable parsing the interfaces file. 


```javascript
var network = require('network-config');

network.interfaces(function(err, interfaces){
  /* interfaces should be something like:

  [{
    name: 'eth0',
    ip: '1.1.1.77',
    netmask: '1.1.1.0',
    mac: 'aa:aa:aa:aa:aa:aa',
    gateway: '10.10.10.1', 
   },
   { ... }, { ... }]
  */
 
});

network.interfaces(function(err, interfaces){
  /* interfaces should be something like:

  [{
    name: 'eth0',
    ip: '1.1.1.77',
    netmask: '1.1.1.0',
    mac: 'aa:aa:aa:aa:aa:aa',
    gateway: '10.10.10.1', 
    dhcp: false
   },
   { ... }, { ... }]
  */
 
}, {interfaces: {parse: true, file: '/etc/network/interfaces'}}); //default: parse: false, file: '/etc/network/interfaces'

// ipv6 support

network.interfaces(function(err, interfaces){
  /* interfaces should be something like:

  [{
      name: 'enxb827ebf6e3b1',
      ip: '192.168.10.10',
      ip6: 'fe80::2866:af76:5fd6:11e2',
      ip6Gateway: 'fe80::dea6:32ff:fe63:b8f2',
      ip6prefixlen: '64',
      netmask: '255.255.255.0',
      broadcast: '192.168.10.255',
      mac: 'b8:27:eb:f6:e3:b1',
      gateway: '192.168.10.1'
    }, {
      name: 'lo',
      ip: '127.0.0.1',
      ip6: '::1',
      ip6Gateway: 'fe80::dea6:32ff:fe63:b8f2',
      ip6prefixlen: '128',
      netmask: '255.0.0.0',
      broadcast: null,
      mac: null,
      gateway: '192.168.10.1'
    }, {
      name: 'rename3',
      ip: null,
      ip6Gateway: 'fe80::dea6:32ff:fe63:b8f2',
      netmask: null,
      broadcast: null,
      mac: "b8:27:eb:f6:e3:b1",
      gateway: '192.168.10.1'
    }]
  */
 
}, {gateway: {resolveHostNames: false, route6: true}});
```

### Update interface (static)

```
network.configure('eth0', {
    ip: 'x.x.x.x',
    netmask:'x.x.x.x',
    broadcast: 'x.x.x.x',
    gateway: 'x.x.x.x',
    restart: true // (default) restart networking service right away
}, function(err){

})
```

### Update interface (dhcp)
    
```javascript
network.configure('eth0', {
    dhcp: true,
    restart: false // don't restart networking service
}, function(err){
});
```

# [Changelog](/CHANGELOG.md)
