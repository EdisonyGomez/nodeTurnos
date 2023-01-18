//configuracion servidor

var express = require('express');
var http = require('http');
var https = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jquery = require('jquery');

var routes = require('./routes');
var users = require('./routes/user');

var host='www.akc.co';
var port=8080;


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('port', process.env.PORT || 3000);
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

app.get('/', routes.index);
app.get('/users', users.list);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
 
var io = require('socket.io').listen(server);




var usuariosOnline = {};
//usando socket.io
io.sockets.on('connection', function(socket){
    console.log("requerimiento de conexion");
    socket.emit('connected');

    //recbiendo datos de logeo
    socket.on("conexion", function(data)
    {
        console.log("datos de conexion  "+data);
        var username=data.user;
        //si existe el nombre de usuario en el chat
        if(usuariosOnline[username])
        {
            socket.emit("userInUse");
            return;
        }
        //Guardamos el nombre de usuario en la sesión del socket para este cliente
        socket.username = username;
        //añadimos al usuario a la lista global donde almacenamos usuarios
        usuariosOnline[username] = socket.username;
       
    });

    
    socket.on("updateTails", function(data)
    {
        console.log("actualizacion de colas de conexion  "+data);
        var username=data.user;
        var sede=data.sede;
        var cola=data.cola;

        console.log("la sede es  "+sede);

        var options ={
            host: host,
            port: port,
            path: '/apps/servlet/akcturnos/updateTails'+'?sede='+sede
            
        }

        var respuesta='';
        https.get(options, function(res) {
                res.on('data', function(data) {
                
                respuesta+=data;
				console.log('emito respuesta');
                socket.emit('infoColas',respuesta);
               
            })
        });
		
		


    });


    socket.on("viewAdmin", function(data)
    {
        console.log("Visualizacion requerida");
        var username=data.user;
        var sede=data.sede;
        var caja=data.caja;
        var turno=data.turno;
		var nombre=data.nombre;
		var letra=data.letra;
		var turnoInt=data.turnoInt;
		
		
		console.log(nombre);

        socket.broadcast.emit('viewTurno',{ sede: sede, caja:caja, turno:turno , nombre:nombre , letra:letra, turnoInt:turnoInt });

    });
	
	socket.on("cleanAdmin", function(data)
    {
        console.log("limpieza requerida");
        var username=data.user;
        var sede=data.sede;
        var caja=data.caja;
        
		socket.broadcast.emit('cleanTurno',{ sede: sede, caja:caja });

    });
	
	socket.on("colorAdmin", function(data)
    {
        console.log("limpieza color");
        var username=data.user;
        var sede=data.sede;
        var caja=data.caja;
        
		socket.broadcast.emit('changeColor',{ sede: sede, caja:caja });

    });

   socket.on("updateTailsCaja", function(data)
    {
        console.log("actualizacion de colas de conexion  "+data);
        var username=data.user;
        var sede=data.sede;
        var cola=data.cola;

        console.log("la cola es  "+cola);

       var optionsCaja ={
            host: host,
            port: port,
            path: '/apps/servlet/akcturnos/updateTailsCaja'+'?sede='+sede+'&cola='+cola
            
        }

        var respuesta='';

          https.get(optionsCaja, function(res) {
                res.on('data', function(data) {
                
                respuesta+=data;
                console.log("actualiza caja "+respuesta);
                socket.broadcast.emit('infoColasCaja',respuesta);
                socket.emit('infoColasCaja',respuesta);
               
            })
        });
   
       
    });

   socket.on("tryAtencion", function(data)
    {
        console.log("Solicitud de atencion  ");
        var username=data.user;
        var sede=data.sede;
        var cola=data.cola;

        console.log("la cola es  "+cola);

       var optionsCaja ={
            host: host,
            port: port,
            path: '/apps/servlet/akcturnos/tryAtencion'+'?sede='+sede+'&cola='+cola
            
        }

        var respuesta='';

          https.get(optionsCaja, function(res) {
                res.on('data', function(data) {
                
                respuesta+=data;
                console.log("avisa caja "+respuesta);
                socket.broadcast.emit('sigAuto',respuesta);
                socket.emit('sigAuto',respuesta);
                
               
            })
        });
   
       
    });

    socket.on("saveRecord", function(data)
    {
        console.log("Solicitud de grabacion  ");
        var ip=data.ip;
        var numero=data.numero;
        console.log("la ip es  "+ip);

       var optionsCaja ={
            host: host,
            port: port,
            path: '/apps/servlet/akcturnos/saveRecord'+'?ip='+ip+'&numero='+numero
            
        }

        var respuesta='';

          https.get(optionsCaja, function(res) {
                res.on('data', function(data) {
                
                
               
            })
        });

        
       
    });

     socket.on("stopRecord", function(data)
    {
        console.log("Solicitud de stop  ");
        var ip=data.ip;
        
        console.log("la ip es  "+ip);


       var optionsCaja ={
            host: host,
            port: port,
            path: '/apps/servlet/akcturnos/stopRecord'+'?ip='+ip
            
        }

        var respuesta='';

          https.get(optionsCaja, function(res) {
                res.on('data', function(data) {
                
                
               
            })
        });

        
       
    });



});

function AjaxObj()
{
  var xmlhttp = null;

  if (window.XMLHttpRequest)
  {
    xmlhttp = new XMLHttpRequest();

    if (xmlhttp.overrideMimeType)
    {
      xmlhttp.overrideMimeType('text/xml');
    }
  }
  else if (window.ActiveXObject)
  { 
    // Internet Explorer    
    try
    {
      xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
    }
    catch (e)
    {
      try
      {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
      }
      catch (e)
      {
        xmlhttp = null;
      }
    }
    
    if (!xmlhttp && typeof XMLHttpRequest!='undefined')
    {
      xmlhttp = new XMLHttpRequest();
      
      if (!xmlhttp)
      {
        failed = true;
      }
    }
  }
  return xmlhttp;
}




/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});



/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
