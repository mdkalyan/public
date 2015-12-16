 angular.module('feedbackApp', [])
 .controller('feedbackCtrl', ['$scope', function($scope) {
     
     
              $scope.branchJson = [];
               $scope.branchJson = getCookie('branchName');
               $scope.branchName = JSON.parse($scope.branchJson);
               
              $scope.branchIdJS=[];
            $scope.branchIdJS = getCookie('orgBranchId');
             $scope.branchId = JSON.parse($scope.branchIdJS);
     
    $('select').on('change', function() {
          
         for(var i=0; i<$scope.branchName.length; i++)
         {
         if(this.value ==  $scope.branchName[i] )
                {
                    $scope.organizationBranchId = $scope.branchId[i]; 
                }
          } 
         $.ajax({
        type: "GET",
        headers: {
            'Accept':'application/vnd.teehalf.erx-v1+json',
            'X-ERX-Authentication':'42</B7Tg8o5C7`7<7Ar0?]pJs`@Noplt>I1m>QYQn[v=osDl:unWyx`SYqBK@0?w',
            'Content-Type':'application/json'
        },
        dataType: "json",
        url: "../feedback/results/" + $scope.organizationBranchId + "",
         success: function(data) {     
         var feedbackhtml = "";

            $.each(data.data, function(index3,value3) {

                    if(value3.feedBackQuestionDTO.fieldType.id == 6) {//star
                        feedbackhtml += '<div class="col-sm-3" id=' + value3.feedBackQuestionDTO.id + '></div>';
                    }else{
                        feedbackhtml += '<div id=' + value3.feedBackQuestionDTO.id + '></div>';
                    }

            });

            $("#feedback_results_container").html(feedbackhtml);


            $.each(data.data, function(index3,value3) {


                var col = ["#ff0000","ff6e6e","fff4b3","88fb6e","2fff00"];

                if(value3.feedBackQuestionDTO.fieldType.id == 6) {//star
                    var array = [
                        ["number", "votes", {role: "style"}]
                    ];
                    $.each(value3.starRatings, function(index4,value4) {
                        array.push([index4,value4,col[index4]]);
                    });
                    var data = google.visualization.arrayToDataTable(array);

                    var view = new google.visualization.DataView(data);
                    view.setColumns([0, 1,
                        {
                            calc: "stringify",
                            sourceColumn: 1,
                            type: "string",
                            role: "annotation"
                        },
                        2]);

                    var options = {
                        title: value3.feedBackQuestionDTO.question,
                        width: "100%",
                        height: 250,
                        bar: {groupWidth: "95%"},
                        legend: {position: "none"},
                    };
                    var chart = new google.visualization.BarChart(document.getElementById(value3.feedBackQuestionDTO.id));
                    chart.draw(view, options);
                }else{
                     var freeText = '<div class=" col-sm-6 col-xs-12">';
                    freeText += '<h4>'+ value3.feedBackQuestionDTO.question +'</h4>';
                    $.each(value3.freeText, function(index4,value4) {
                        freeText += '<p>'+ value4.value +'</p>';
                    });
                    freeText +='</div>';
                    document.getElementById(value3.feedBackQuestionDTO.id).innerHTML =freeText;
                }

            });

            $("#feedback_container").show();
         },
        error: function () {
            alert("failure");
        }
         });   
     });
 
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