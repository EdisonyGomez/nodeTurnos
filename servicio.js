var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'NodeJs Akcturnos',
  description: 'Port 3000 Node Js Akcturnos 4 Comunicacion',
  script: 'D:\\webserver\\NodeJs\\akcturnos4\\app.js'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();