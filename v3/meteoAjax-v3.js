var json;

$(document).ready(function () {
    $("button#graph").attr("disabled", true);
    $("button#meteo").click(function () {
        var ville = $("select#ville option:selected").val();
        console.log('[' + ville + ']');
        //myAjax({"ville" : ville});
        myAjax(ville);
    });
    $('button#meteo2').click(function () {
        var ville2 = $("input#ville2").val();
        myAjax(ville2);
    });
    $('button#graph').click(function () {
        afficherGraphique();

    })

});

function myAjax(ville) {
    console.log(ville);
    $.ajax({
        type: "POST",
        url: "https://www.prevision-meteo.ch/services/json/" + ville,
        dataType: "json",
        async: true,
        data: "",
        success: function (result) {
            
            console.log(result.errors);

            if (result.errors === undefined) {
                json = result;
                afficherMeteo();
                $("button#graph").attr("disabled", false);
            } else {
                afficherErrors(result);
                //obj = result; // ici on range le json dans obj
                console.log(result);
            }
        },
        error: function (result) {
            console.log('result : ', result);
            alert("error");
        },
        complete: function (result) {
            // faire qq chose quand c'est fini
            console.log("fini");
        },
    });
}

function afficherMeteo() {

    console.log('city:', json.city_info.name, 'date:', json.current_condition.date)
    for (var i = 0; i < 5; i++) {
        var prevision = json["fcst_day_" + i];
        console.log('day:', prevision.day_long, 'icon:', prevision.icon, 'cond:', prevision.condition, 'tmin:', prevision.tmin, 'tmax:', prevision.tmax)
        //console.log('day:',json.fcst_day_0.day_long, 'icon:',json.fcst_day_0.icon, 'cond:',json.fcst_day_0.condition, 'tmin:',json.fcst_day_0.tmin, 'tmax:',json.fcst_day_0.tmax)

    }
    var tableau = "<h1>" + json.city_info.name + "</h1>" + "<h2>" + json.current_condition.date + "</h2>"

    tableau += "<table id = 'prev_jours'>";
    tableau += "<tr><td>Jour</td><td>Icone</td><td>Condition</td><td>Tmin</td><td>Tmax</td></tr>"
    for (var i = 0; i < 5; i++) {
        var prevision = json["fcst_day_" + i];

        tableau += "<tr><td>" + prevision.day_long + "</td><td><img src = '" + prevision.icon + "'></td><td>" + prevision.condition + "</td><td>" + prevision.tmin + "°C</td><td>" + prevision.tmax + "°C</td></tr>"
    }
    tableau += "</table>"
    $("#madiv").html(tableau)
}
function afficherErrors(json) {
    var p = "<p>" + json.errors[0].code + " " + json.errors[0].text + "</p>"
    $("#madiv").html(p)
}

function afficherGraphique() {

    var jours = [];
    var Tmin = [];
    var Tmax = [];

    $.each(json, function (key, value) {
        if (!key.startsWith("fcst_day_")) return;
        jours.push(value.day_short);
        Tmin.push(value.tmin);
        Tmax.push(value.tmax);
    })

    Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        title: {
            text: json.city_info.name,
            align: 'center'
        },
        subtitle: {
            text:
                'Source: <a target="_blank" ' +
                'href="https://www.prevision-meteo.ch/">prevision-meteo.ch</a>',
            align: 'left'
        },
        xAxis: {
            categories: jours,
            crosshair: true,
            accessibility: {
                description: 'Températures'
            }
        },
        yAxis: {
            //min: -20,
            title: {
                text: 'Températures (°C)'
            }
        },
        tooltip: {
            valueSuffix: ' (°C)'
        },
        /*
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        */
        series: [
            {
                name: 'Tmin',
                data: Tmin
            },
            {
                name: 'Tmax',
                data: Tmax
            }
        ]
    });
    
}