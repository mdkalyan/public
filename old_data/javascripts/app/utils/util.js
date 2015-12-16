var MedStac = {};

(function () {

    MedStac.Utils = {};
    MedStac.Utils.WorkingNotification = {
        show:function () {
            return $('#workingWidgetNotification').show();
        },
        hide:function () {
            return $('#workingWidgetNotification').hide();
        }
    };
    MedStac.Utils.StatusNotification ={
        show : function (status,message) {
            var width;
            if (status && status) {
                switch(status){
                    case "SUCCESS":
                        $('#statusWidgetNotification').addClass('success');
                        break;
                    case "FAIL":
                        $('#statusWidgetNotification').addClass('error');
                        break;
                    case "INFO":
                        $('#statusWidgetNotification').addClass('info');
                        break;
                }

            }
          $("#statusWidgetNotification").html(message).css("display", "inline-block");
          width = $("#statusWidgetNotification").width();
          $("#statusWidgetNotification").css("margin-left", (width / 2) * (-1));    
          return window.setTimeout(MedStac.Utils.StatusNotification.hide,5000);
        },
        hide : function() {
          $("#statusWidgetNotification").slideUp();
          $("#statusWidgetNotification").removeClass("error");
          $("#statusWidgetNotification").html("");
          return $("#statusWidgetNotification").removeClass("info");            
        }
    };

    MedStac.Constants = {};
        
    
}).call(this);

function substitute(str, data) {
    var output = str.replace(/%[^%]+%/g, function(match) {
        if (match in data) {
            return(data[match]);
        } else {
            return("");
        }
    });
    return(output);
}