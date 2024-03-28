var allowedHost = 'docs.seqera.io';
var hotjarAppID = 3836890;

function canProceed() {
  if (typeof window === 'undefined') return false;
  if (window.location.hostname !== allowedHost) return false;
  return true;
}

function addScripts() {

  if(!canProceed()) return;

  // Usersnap
  (function usersnap() {
    window.onUsersnapLoad = function (api) {
      api.init();
    };
    var script = document.createElement("script");
    script.defer = 1;
    script.src =
      "https://widget.usersnap.com/global/load/feddb12e-0a8b-45c2-86c1-56f5a9d428f6?onload=onUsersnapLoad";
    document.getElementsByTagName("head")[0].appendChild(script);
  })();

  // HotJar
  (function(h,o,t,j,a,r){
    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
    h._hjSettings={hjid:hotjarAppID,hjsv:6};
    a=o.getElementsByTagName('head')[0];
    r=o.createElement('script');r.async=1;
    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
    a.appendChild(r);
  })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');

}

addScripts();