'use strict';
 angular.module('carecircleApp', [])
    .controller('loginCtrl', ['$scope', function($scope) {
        
        $scope.submit= function(){
       // window.location.href = "../logins/" + $scope.inputEmail + "/" +$scope.inputPassword;   
         $.ajax({
        type: "GET",
        headers: {
            'Accept':'application/vnd.teehalf.erx-v1+json',
            'X-ERX-Authentication':'42</B7Tg8o5C7`7<7Ar0?]pJs`@Noplt>I1m>QYQn[v=osDl:unWyx`SYqBK@0?w',
            'Content-Type':'application/json'
        },
        dataType: "json",
        url: "../logins/"+$scope.inputEmail+"/"+$scope.inputPassword+"",
        success: function(data) {
             $scope.branchName =[];
            $scope.branchId=[];
            for(var j=0; j<data.data.logins.length; j++)
            {
                $scope.branchName.push(data.data.logins[j].branchLogins[0].organizationBranch.name);
                $scope.branchId.push(data.data.logins[j].branchLogins[0].organizationBranch_id); 
            }
            $scope.branchJson= JSON.stringify($scope.branchName);
            $scope.branchIdJs = JSON.stringify($scope.branchId);
            
            
            
            $scope.branchId = data.data.logins[0].branchLogins[0].organizationBranch_id;
            loaded();
            location.href="feedback.html";
            //console.log(data);
        },
        error: function () {
            alert("failure");
        }
         });
      };
         
        $scope.loginSuccess = getCookie('loginStatus'); 
        function loaded() {
     document.cookie = "loginStatus=true;";
     document.cookie = "orgBranchId =" + $scope.branchIdJs +";";
     document.cookie = "branchName=" + $scope.branchJson  +";";        
    // alert(document.cookie);
     }

    function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}
        
    }]);

