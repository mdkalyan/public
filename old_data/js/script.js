
$( document ).ready(function() {
    $("#feedback_container").hide();
});

$("#form-signin").submit(function(e){
    e.preventDefault();
});

var branchLogins=[];

var getSignInData = function(){

    var inputEmail=document.getElementById('inputEmail').value;
    var inputPassword=document.getElementById('inputPassword').value;

    $.ajax({
        type: "GET",
        headers: {
            'Accept':'application/vnd.teehalf.erx-v1+json',
            'X-ERX-Authentication':'42</B7Tg8o5C7`7<7Ar0?]pJs`@Noplt>I1m>QYQn[v=osDl:unWyx`SYqBK@0?w',
            'Content-Type':'application/json'
        },
        dataType: "json",
        url: "logins/"+inputEmail+"/"+inputPassword+"",
        success: function(data) {

            //alert(data.data.logins);
            $.each(data.data.logins, function(index, value) {
                $.each(value.branchLogins, function(index2, value2) {
                    branchLogins.push(value2);
                });
            });

            var options = [];
            $.each(branchLogins, function(index3,value3) {
                options.push(value3);
            });
            //alert(options);

            var feedbackhtml = "<h1> Feedback </h1>";
            feedbackhtml+= "<select id='orgbranchid'>";
            $.each(branchLogins, function(index3,value3) {
                feedbackhtml+= '<option id='+ value3.organizationBranch.id+'>'+ value3.organizationBranch.name+'</option>';
            });
            feedbackhtml += "</select>";
            feedbackhtml += '<button onclick="getorgbranchid();return false;" type="submit"> Go </button>';

            $("#feedback_container").html(feedbackhtml);
            $("#feedback_container").show();
            $("#sign_in_container").hide();
            //alert(branchLogins);

        },
        error: function () {
            alert("failure");
        }
    });
    //alert("last closing");
};





var getorgbranchid = function(){


    var e = document.getElementById("orgbranchid");
    var blId = e.options[e.selectedIndex].id;

    var d = new Date();
    d.setHours(0,0,0,0);
    var millis = d.getTime();
    //alert(" value ==>"  +blId);
    $.ajax({
        type: "GET",
        headers: {
            'Accept':'application/vnd.teehalf.erx-v1+json',
            'X-ERX-Authentication':'42</B7Tg8o5C7`7<7Ar0?]pJs`@Noplt>I1m>QYQn[v=osDl:unWyx`SYqBK@0?w',
            'Content-Type':'application/json'
        },
        dataType: "json",
        //url: "/feedback/results/"+blId+"/"+millis+"/"+millis,
        url: "/feedback/results/"+blId+"",
        success: function(data) {

            var feedbackhtml = "";

            $.each(data.data, function(index3,value3) {

                    if(value3.feedBackQuestionDTO.fieldType.id == 6) {//star
                        feedbackhtml += '<div id=' + value3.feedBackQuestionDTO.id + ' style="float: left;"></div>';
                    }else{
                        feedbackhtml += '<div id=' + value3.feedBackQuestionDTO.id + ' style="display: inline-block;"></div>';
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
                        width: 300,
                        height: 200,
                        bar: {groupWidth: "95%"},
                        legend: {position: "none"},
                    };
                    var chart = new google.visualization.BarChart(document.getElementById(value3.feedBackQuestionDTO.id));
                    chart.draw(view, options);
                }else{
                    var freeText = "</br>";
                    freeText += '<h4>'+ value3.feedBackQuestionDTO.question +'</h4> </br>';
                    $.each(value3.freeText, function(index4,value4) {
                        freeText += '<p>'+ value4.value +'</p> </br>';
                    });
                    document.getElementById(value3.feedBackQuestionDTO.id).innerHTML =freeText;
                }

            });

            $("#feedback_container").show();
            $("#sign_in_container").hide();
            //alert(branchLogins);

        },
        error: function () {
            alert("failure");
        }
    });
    //alert("last closing");
};
