const publicVapidKey =
  "BJMIoRIuyzNXRYvtim5sMSPZcQp6gy-TMeGgfI_aqqmJGPtutT1AL7mEuEZX8Fjw-G-oQQdKmdrTVVwls_FJivo";

// Check for service worker
if ("serviceWorker" in navigator) {
  send().catch(err => console.error(err));
}


async function send() {
  // REGISTRA EL SERVICE WORKER
  console.log("Registrando service worker...");
  const register = await navigator.serviceWorker.register("./worker.js", {
    scope: "/"
  });
  console.log("Service Worker Registrado...");

  // REGISTRA EL PUSH
  console.log("Registrando alerta de notificacion...");
  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
  });
  console.log("alerta de notificacion registrada...");

  // ENVÍA UN PUSH PARA LA NOTIFICACIÓN
  console.log("Enviando alerta de notificacion...");
  await fetch("/subscribe", {
    method: "POST",
    body: JSON.stringify(subscription),
    headers: {
      "content-type": "application/json"
    }
  });
  console.log("Alerta de notificacion enviada...");
}

// FUNCION QUE CONVIERTE LAS CLAVES EN ARRAY
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}