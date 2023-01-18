console.log("Service Worker cargado...");

self.addEventListener("push", e => {
  const data = e.data.json();
  console.log("alerta de notificacion recibida...");
  self.registration.showNotification(data.title, {
    body: "Se ha generado un nuevo turno!",
    icon: "./icono.png",
    vibrate: [100, 100, 100],
  });
});