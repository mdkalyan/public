"use strict"

  function upload() {
    var _submit = document.getElementById('_submit');
    var _file = document.getElementById('_file');
    
    if (_file.files.length === 0) {
      return;
    }
    var data = new FormData();
    data.append('SelectedFile',_file.files[0]);
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
      try{
        var resp = JSON.parse(request.response);
      }catch(e){

      }
    }
    request.open('POST', 'http://localhost:9000/file/upload');
    request.send(data);
  } 


angular.module('InterceptorService', [])
    .config(function ($httpProvider) {
        $httpProvider.responseInterceptors.push('httpInterceptor');
        var spinnerFunction = function (data, headersGetter) {
            MedStac.Utils.WorkingNotification.show();
            return data;
        };
        $httpProvider.defaults.transformRequest.push(spinnerFunction);
    })
// register the interceptor as a service, intercepts ALL angular ajax http calls
    .factory('httpInterceptor', function ($q, $window) {
        return function (promise) {
            return promise.then(function (response) {
                MedStac.Utils.WorkingNotification.hide();
                return response;
            }, function (response) {
                MedStac.Utils.WorkingNotification.hide();
                MedStac.Utils.StatusNotification.show('error','Server returned error. Contact your administrator.');
                return $q.reject(response);
            });
        };
    });

    
var app = angular.module('app', ['app.services','app.filters','ui.bootstrap.dialog','ui.compat','ui.keypress','InterceptorService']);

app.config(['$stateProvider', '$routeProvider', '$urlRouterProvider',function($stateProvider, $routeProvider, $urlRouterProvider){
        $routeProvider
            .when('/',
                {redirectTo: '/'}
            );
        $stateProvider
          .state('users',{
            url: '/users',
            templateUrl : 'partials/import.html',
            controller : ImportCtrl
          });

        /*$stateProvider
            .state('register',{
                url: '/register',
                templateUrl : 'partials/retailer/retailer.register.html',
                controller : AdminCtrl  
            });*/
    }]);
    
app.controller('HeaderCtrl', ['$scope', '$location', '$route', '$dialog', 'BroadcastService', function ($scope, $location, $route,$dialog,AuthenticationService,BroadcastService) {
    $scope.location = $location;

}]);    

app.directive('autoComplete', function($timeout) {
    return function(scope, iElement, iAttrs) {
        iElement.autocomplete({
            source: scope[iAttrs.items],
            select: function() {
                $timeout(function() {
                  iElement.trigger('input');
                }, 0);
            }
        });
    };
}).directive('paginatorWidget', function($timeout) {
    var directive = {
        templateUrl: 'partials/pager.html',
        restrict: 'E',
        replace: true,
        scope: true,
        link: function($scope, $element, $attrs, $controller) {

        }
      };
      return directive;
}).directive('businessDropdown', function($compile) {
    var directive = {
        restrict: 'E',
        scope: {
            businesses : '=businessList',
            retailer:'=retailer'
        },
        link:function(scope,element,attrs){
            element.append($compile('<div class="btn-group" ><a class="btn btn-primary dropdown-toggle" data-toggle="dropdown" href="#">Select Business<span class="caret"></span></a><ul class="dropdown-menu" ng-repeat="business in businesses"><li><a href ng-click="itemSelected(business)">{{business.name}}</a></li></ul></div>')(scope));            
        }
      };
      return directive;
}).directive('bsDropdown', function ($compile) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            items: '=dropdownData',
            doSelect: '&selectVal',
            selectedItem: '=preselectedItem'
        },
        link: function (scope, element, attrs) {
            var html = '';
            switch (attrs.menuType) {
                case "button":
                    html += '<div class="btn-group"><button class="btn button-label btn-info">Action</button><button class="btn btn-info dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button>';
                    break;
                default:
                    html += '<div class="dropdown"><a class="btn btn-primary dropdown-toggle" role="button" data-toggle="dropdown"  href="javascript:;">Select Business<span class="caret"></span></a>';
                    break;
            }
            html += '<ul class="dropdown-menu"><li ng-repeat="item in items"><a tabindex="-1" data-ng-click="selectVal(item)">{{item.name}}</a></li></ul></div>';
            element.append($compile(html)(scope));

            scope.selectVal = function (item) {
                switch (attrs.menuType) {
                    case "button":
                        $('button.button-label', element).html(item.name);
                        break;
                    default:
                        $('a.dropdown-toggle', element).html(item.name + '<b class="caret"></b> ' );
                        break;
                }

                scope.doSelect({
                    selectedVal: item
                });
            };
            //scope.selectVal(scope.bSelectedItem);
        }
    };
});
app.directive('onMouseOut', [function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('mouseleave', function(key){
              scope.$apply(attrs.onMouseOut);
            });
        }
    };
}]);
app.directive('onMouseOver', [function (item) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('mouseleave', function(key){
              scope.$apply(onMouseOver(item));
            });
        }
    };
}]);
app.directive('onMouseDown', [function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('mousedown', function(key){
              scope.$apply(attrs.onMouseDown);
            });
        }
    };
}]);
var INTEGER_REGEXP = /^\-?\d*$/;
app.directive('integer', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function(viewValue) {
        if (INTEGER_REGEXP.test(viewValue)) {
          // it is valid
          ctrl.$setValidity('integer', true);
          return viewValue;
        } else {
          // it is invalid, return undefined (no model update)
          ctrl.$setValidity('integer', false);
          return undefined;
        }
      });
    }
  };
});
var FLOAT_REGEXP = /^\d{0,2}(?:\.\d{0,2}){0,1}$/;
app.directive('float', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function(viewValue) {
        if (FLOAT_REGEXP.test(viewValue)) {
          // it is valid
          ctrl.$setValidity('float', true);
          return viewValue;
        } else {
          // it is invalid, return undefined (no model update)
          ctrl.$setValidity('float', false);
          return undefined;
        }
      });
    }
  };
});
app.directive('toDate',function(){
    return {
        link:function(scope,elm,attrs){
            elm.text(Date(paseInt(attrs[0])));
        }
    }
});
app.directive('pwCheck', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
        var firstPassword = '#' + attrs.pwCheck;
        elm.add(firstPassword).on('keyup', function(){
            scope.$apply(function() {
                var va = elm.val() == $(firstPassword).val();
                ctrl.$setValidity('pwmatch',va);
            })
        });
    }
  };
});
/*app.directive('pwCheck',function () {
    return{
        require: 'ngModel',
        link: function(scope,elm,attrs,ctrl){
            var firstPassword = '#' + attrs.pwCheck;
            elm.add(firstPassword).on('keyup', function(){
                scope.$apply(function(){
                    var v = elem.val() === $(firstPassword).val();
                    ctrl.$setValidity('pwmatch',v);
                });
            });
        }
    }    
});*/
app.directive('onKeydown', [function () {
    return {
        restrict: 'E',
        link: function (scope, element, attrs) {
            function applyKeydwon () {
                scope.$apply(attrs.onKeydown);
            };
            element.bind('keyup', eventData, function(key){
                if(key == 13){
                    applyKeydwon();
                }
            });
        }
    };
}]);

app.directive('noOfSlabsWatcher', [function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            scope.$watch('noOfSlabsWatcher',function(value){
                scope.loyaltyDetails = new Array(value);
            });
        }
    };
}]);

var models = angular.module('app.models',['ngResource']);

function redirectTo ($location,url) {
    $location.path(url);
}

function onMouseOver(item){
    $("#tootl-tip").tooltip();   
}