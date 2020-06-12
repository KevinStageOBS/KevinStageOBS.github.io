/* Bump the service worker version in this comment to make sure changes to imported scripts are reflected on the client/browser.
SERVICE WORKER VERSION = 6
*/ 

importScripts('flutter_service_worker.js');


const local_notification_tag = 'local-notification-test-tag';
const push_notification_tag = 'push-notification-test-tag';
const scheduled_notification_tag = 'push-notification-test-tag';


// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if(event.notification.tag == local_notification_tag) {
    console.log('click on local notification');
  } 
  else if(event.notification.tag == push_notification_tag) {
    event.waitUntil(clients.openWindow("https://www.youtube.com/watch?v=dQw4w9WgXcQ"));
  } else {
     event.waitUntil(clients.openWindow("/"));
  }
});


// Sync handler
self.addEventListener('sync', function(event) {
  if (event.tag == 'syncTag') {
    event.waitUntil(syncData());
  }
});


// Message post handler
self.addEventListener('message', function(event) {
    if(event.data.type == 'schedule-notification') {
      const title = event.title;
      const options = {
        body: event.body,
        tag: scheduled_notification_tag,
        //showTrigger: new TimestampTrigger(event.delay)
        showTrigger: new TimestampTrigger(new Date().getTime() + 5 * 1000)
      };

      event.waitUntil(self.registration.showNotification(title, options));
    } else if(event.data.type == 'bubble-sort') {
      var array = event.data.array;
      array = bubbleSort(array);
      this.console.log(array);
      event.ports[0].postMessage({'type': 'bubble-sort', 'array': array});
    } else {
      console.log(event);
    }
});


// Sync method
function syncData() {
  const title = "The data can now be synchronized."
  const notificationOptions = {
      body: "Click here to open the website",
  };
  
  return self.registration.showNotification(title, notificationOptions);
}

// Push notification event handler
self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);
  var mtitle = JSON.parse(event.data.text()).title;
  var mbody = JSON.parse(event.data.text()).text;

  const title = mtitle;
  const options = {
    body: mbody,
    tag: push_notification_tag
    //icon: 'images/icon.png',
    //badge: 'images/badge.png'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});



// Bubble sort method
function bubbleSort(array)  {
  var changed;
  do {
    changed = false;
    for(var i=0; i < array.length-1; i++) {
      if(array[i] > array[i+1]) {
        var tmp = array[i];
        array[i] = array[i+1];
        array[i+1] = tmp;
        changed = true;
      }
    }
  } while(changed);
  return array;
}







// Permet de défnir un comportement si une ressource n'est pas accessible.
// self.addEventListener('fetch', event => {
//   const url = new URL(event.request.url);

//   if (url.origin == location.origin && url.pathname == '/dog.svg') {
//     event.respondWith(caches.match('/horse.svg'));
//   }
// });