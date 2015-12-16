var services = angular.module('app.services',['ngResource','ui.bootstrap.dialog']);
services.factory('BroadcastService', function($rootScope){
    return {
      broadcast: function(event,message){
        $rootScope.$broadcast('broadcastHandler',event,message)
      }
    };
});
services.factory('CRUDService',['$http','$q','$resource', function ($http, $q, $resource){
    var service = {
      query: function (url,id) {
        var resource = $resource(url, { }, {
              'query' : { method: 'GET', params: {}},
        });        
        var defered = $q.defer();
        var result = resource.query({
        }, function() {
            defered.resolve(result);
        });
        return defered.promise;           
      },
      save: function (item,user,url){
        //var url = controller + '/' + 'create';
        var defered = $q.defer();
        var resource = $resource(url, { }, {        
              'save': { method: 'POST', params: {entity:'@entity'}}
        });
        var result = resource.save({
            entity : item,
          },function(){
          defered.resolve(result);
        });
        return defered.promise;
      },
      update: function (item,url) {
        var defered = $q.defer();
        var resource = $resource(url, {}, {
          'update': { method: 'POST', params: {ViewModel: '@ViewModel'}}
        });            
        var result = resource.update({
            item : item
          },function(){
          defered.resolve(result);
        });
        return defered.promise;        
      }
    }
    return service;
}]);
services.factory('DialogService',['$http','$q','$resource','$dialog','BroadcastService', function ($http,$q,$resource,$dialog,BroadcastService) {
    var dialog = null;
    var service = {
      onDialogClose: function(success) {
        dialog = null;
      },
      close : function(success) {
        if(dialog){
          dialog.close(success);
        }
      },
      status:function(){
        return (dialog === null)?"Closed":"Open"  ;
      },
      show: function(template,controller){
        if(dialog){
          dialog=null;
        }
        var options = {
          backdrop: true,
          keyboard: true,
          backdropClick: false,
              dialogFade:true,
              backdropFade:true             
        }
        dialog = $dialog.dialog(options);
        if (controller) {
          dialog.open(template,controller);
        }else{
          dialog.open(template);
        }
      }
    }
   return service;
  }]);
