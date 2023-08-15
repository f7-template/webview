//INICIALIZAÇÃO DO F7 QUANDO DISPOSITIVO ESTÁ PRONTO
document.addEventListener('deviceready', onDeviceReady, false);
var app = new Framework7({
  // App root element
  el: '#app',
  // App Name
  name: 'Webview Modelo',
  // App id
  id: 'br.com.webview.modelo',
  // Enable swipe panel
  panel: {
    swipe: true,
  },
  dialog: {
    buttonOk: 'Sim',
    buttonCancel: 'Cancelar',
  },
  // Add default routes
  routes: [
    {
      path: '/index/',
      url: 'index.html',
      animate: false,
      on: {
        pageInit: function (event, page) {
          app.views.main.router.navigate('/home/');
        }
      }
    },
    {
      path: '/home/',
      url: 'home.html',
      animate: false,
      on: {
        pageInit: function (event, page) {
          //VARIAVEL GLOBAL
          var ref;

          //FUNÇÃO PARA RODAR WEBVIEW	
          function webView() {

            //PUXAR A PÁGINA DO SITE (MUDE O SITE PARA SUA PÁGINA)
            ref = cordova.InAppBrowser.open('https://curso.programacaoweb.com.br', '_blank', 'location=no,zoom=no,clearcache=yes');

            //EXIBIR A PÁGINA
            ref.show();

            //LISTENER PARA OUVER EVENTO CARREGAR, QUANDO PARAR DE CARREGAR, ERRO
            ref.addEventListener('loadstart', inAppBrowserbLoadStart);
            ref.addEventListener('loadstop', inAppBrowserbLoadStop);
            ref.addEventListener('loaderror', inAppBrowserbLoadError);

            //LISTENER PARA VERIFICAR QUANDO SAIR DO WEBVIEW
            ref.addEventListener('exit', function (event) {
              ref.close();
              //QUANDO FECHAR ABRIR DENOVO TELA PRINCIPAL
              setTimeout(function () {
                verificaConexao();
              }, 100);

            });

            //QUANDO COMEÇAR A CARREGAR A PÁGINA APARECER CARREGANDO
            function inAppBrowserbLoadStart(event) {
              navigator.notification.activityStart("Carregando", " ");

            }

            //QUANDO TERMINAR DE CARREGAR A PÁGINA FECHAR NOTIFICAÇÃO DE CARREGANDO
            function inAppBrowserbLoadStop(event) {
              navigator.notification.activityStop();
            }

            //QUANDO DER ERRO FECHAR NOTIFICAÇÃO DE CARREGANDO FECHAR WEBVIEW
            function inAppBrowserbLoadError(event) {
              navigator.notification.activityStop();
              ref.close();
            }

          }

          //FUNÇÃO PARA VERIFICAR CONEXAO
          function verificaConexao() {

            //VERIFICAR SE TEM INTERNET
            var networkState = navigator.connection.type; //chamada do plugin

            //DAR NOMES PARA OS STATUS DE REDE
            var states = {};
            states[Connection.UNKNOWN] = 'desconhecida';
            states[Connection.ETHERNET] = 'cabo';
            states[Connection.WIFI] = 'wifi';
            states[Connection.CELL_2G] = '2g';
            states[Connection.CELL_3G] = '3g';
            states[Connection.CELL_4G] = '4g';
            states[Connection.CELL] = 'celular';
            states[Connection.NONE] = 'nenhuma';

            //SE A REDE FOR "NENHUMA" OU "DESCONHECIDA"
            if ((states[networkState] == 'nenhuma') || (states[networkState] == 'desconhecida')) {

              //SEM INTERNET						
              //remove a classe "display-none" que escondia o conteudo "sem internet" na pagina Home
              $("#semInternet").removeClass("display-none");

              //REMOVE PRELOADER E NOTIFICAÇÃO DE CARREGANDO
              app.preloader.hide();
              navigator.notification.activityStop();

            } else {
              //TEM INTERNET

              //ACIONA WEBVIEW
              setTimeout(() => {
                webView();
              }, 100);


              //CARREGANDO NO FUNDO
              app.preloader.show();

            }
          }

          //CHAMADA PARA VERIFICAR CONEXAO
          verificaConexao();

          //ESCUTAR QUANDO MUDAR DE OFFLINE PARA ONLINE
          document.addEventListener("online", onOnline, false);

          //QUANDO ESTIVER ONLINE					
          function onOnline() {
            //ESCONDER O CARD "SEM INTERNET" 
            $("#semInternet").addClass("display-none");
            //RODAR WEBVIEW						
            webView();
          };
        }
      }
    },
  ],
  // ... other parameters
});

//Para testes direto no navegador
//var mainView = app.views.create('.view-main', { url: '/index/' });

function onDeviceReady() {
  //Quando estiver rodando no celular
  var mainView = app.views.create('.view-main', { url: '/index/' });

  //COMANDO PARA "OUVIR" O BOTAO VOLTAR NATIVO DO ANDROID 	
  document.addEventListener("backbutton", function (e) {

    if (mainView.router.currentRoute.path === '/home/') {
      e.preventDefault();
      app.view.current.router.refreshPage();
    } else {
      e.preventDefault();
      mainView.router.back({ force: true });
    }
  }, false);

}
