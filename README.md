# network-config

Network configuration for NodeJS. **Only tested on Debian**

# npm

```
npm install network-config
```

# usage

## List active interfaces

```javascript
var network = require('network-config');

network.interfaces(function(err, interfaces){
  /* interfaces should be something like:

  [{
    name: 'eth0',
    ip: '1.1.1.77',
    netmask: '1.1.1.0',
    mac: 'aa:aa:aa:aa:aa:aa',
    gateway: '10.10.10.1'
   },
   { ... }, { ... }]
  */
 
});
```

## Update interface (static)

```
network.configure('eth0', {
    ip: 'x.x.x.x',
    netmask:'x.x.x.x',
    broadcast: 'x.x.x.x',
    gateway: 'x.x.x.x'    
}, function(err){

})
```

## Update interface (dhcp) (coming soon)
    
```javascript
network.configure('eth0', {
    dhcp: true
}, function(err){
});
```
