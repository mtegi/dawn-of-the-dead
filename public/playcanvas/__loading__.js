function exec() {

class IframeManager {
  constructor() {
    if (IframeManager._instance) {
      return IframeManager._instance
    }
    IframeManager._instance = this;
  }

  init(app) {
   if(!this.app) { 
     this.app = app;   
     this.connect();
     this.app.on('frontend:send', this.sendMessage, this); 
    }
  }

  connect() {
    window.addEventListener("message", function(event){
        this.parseMessage(event);
    }.bind(this));
   this.sendMessage({ type: 'IFrameReady' });
  }

  sendMessage(data) {
    if( !data?.type ) return;
    parent.postMessage(data, '*');
  }

  parseMessage(event) {
    if (!event.data) return;
    var data = event.data.data;
    if(event.data?.type) {
      this.app.fire(event.data.type, data);
    }
  }
}


pc.script.createLoadingScreen(function (app) {
 const iframeManager = new IframeManager();    
 iframeManager.init(app);   

 var onProgress = function (value) {
     app.fire('frontend:send', { type:'LOAD', loaderProgress: value });
 };

 var onStart = function (value) {
     app.fire('frontend:send', { type: 'START' });
 };

    app.on('preload:end', function () {
        app.off('preload:progress');
    });
    app.on('preload:progress', onProgress);
    app.on('start', onStart);
});

}

exec();