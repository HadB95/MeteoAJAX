function myAjax(ville){
    console.log(ville);
    $.ajax({
        type: "POST",
        url: "https://www.prevision-meteo.ch/services/json/"+ville,
        dataType: "json",
        async: true,
        data : "",
        success: function (result) {
            afficherMeteo(result)
            //obj = result; // ici on range le json dans obj
            console.log(result);
        },
        error: function (result) {
            console.log('result : ', result)
            alert("error");
        },
        complete: function (result) {
            // faire qq chose quand c'est fini
            console.log("fini");
        },
    });
} 

function afficherMeteo(json){
    
    console.log('city:',json.city_info.name,'date:',json.current_condition.date)
    for (var i = 0; i < 5; i++) {
        var prevision = json["fcst_day_" + i];
        console.log('day:',prevision.day_long, 'icon:',prevision.icon, 'cond:',prevision.condition, 'tmin:',prevision.tmin, 'tmax:',prevision.tmax)
        //console.log('day:',json.fcst_day_0.day_long, 'icon:',json.fcst_day_0.icon, 'cond:',json.fcst_day_0.condition, 'tmin:',json.fcst_day_0.tmin, 'tmax:',json.fcst_day_0.tmax)

    }
    var tableau  = "<h1>"+json.city_info.name+"</h1>" + "<h2>"+json.current_condition.date+"</h2>"

    tableau +="<table id = 'prev_jours'>";
    tableau += "<tr><td>Jour</td><td>Icone</td><td>Condition</td><td>Tmin</td><td>Tmax</td></tr>"
        for (var i = 0; i < 5; i++) {
            var prevision = json["fcst_day_" + i];

            tableau += "<tr><td>"+ prevision.day_long +"</td><td><img src = '"+ prevision.icon +"'></td><td>"+prevision.condition+"</td><td>"+prevision.tmin+ "°C</td><td>"+prevision.tmax+"°C</td></tr>"
        }
         
    
    
    
    
    
    tableau += "</table>"
    $("#madiv").html(tableau)
    
}