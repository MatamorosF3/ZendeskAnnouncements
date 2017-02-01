function showInfo(data) {
    console.log("Show info");
    console.log(data2);

    var context = {};
    var rows = [];

    data2.values.forEach(function(value, index){
    	rows.push({organization: value[0], issue: value[1] });
    });

    context.items = rows;

    Handlebars.registerHelper('data_rows', function(){
    	var issue = Handlebars.escapeExpression(this.issue),
    	organization = Handlebars.escapeExpression(this.organization);

    	return new Handlebars.SafeString(
    		"<td>" + this.organization + "</td> <td>"+ this.issue+ " </td> <td> <button onclick=getModal()>" + "Show Info</button></td>"
    		);
    });


    console.log("Context");
    console.log(context);

    console.log(data2.values[0]);
    var requester_data = {
        'name': data2.values[0], //gets column of organization
        'tags': data2.values[1], // gets column of issue
        'created_at': '',
        'last_login_at': ''
    };

    var source = $("#requester-template").html();
    var template = Handlebars.compile(source);
    var html = template(context);
    $("#content").html(html);
}

function googleSheetAPI() {
	client.request().then(function(data){

	},
	function (response){

	});

    // $.ajax({
    //     url: 'https://sheets.googleapis.com/v4/spreadsheets/12pqFnj8GHHvRAWOZhy9_ToGTlriSD6h4qgqokWBDXt4/values/A3:F4?majorDimension=ROWS',
    //     dataType: 'json',
    //     type: 'GET',
    //     data: {
    //         key: 'AIzaSyDpAf0KU_C0y1X4o8P0lKoKzCgYaGos1z4'
    //     },
    //     success: function(data) {
    //     	var data_exchange = data;
    //         console.log(data);
    //         showInfo(data_exchange);

    //         data.values.forEach(function(value, index) {
    //             console.log(index);
    //             console.log(value);
    //         });

    //     },

    //     error: function(error) {

    //         console.error(error.responseText);
    //     }
    // });

}

function showError() {
    var error_data = {
        'status': 404,
        'statusText': 'Not found'
    };
    var source = $("#error-template").html();
    var template = Handlebars.compile(source);
    var html = template(error_data);
    $("#content").html(html);
}

function requestUserInfo(client, id) {
    var settings = {
        url: 'https://sheets.googleapis.com/v4/spreadsheets/12pqFnj8GHHvRAWOZhy9_ToGTlriSD6h4qgqokWBDXt4/values/A3:F6?majorDimension=ROWS&key=AIzaSyDpAf0KU_C0y1X4o8P0lKoKzCgYaGos1z4',
        type: 'GET',
        dataType: 'json'
    };

    //AIzaSyDBTsRtzFD_zP9roETKYw6R9mnPQW7_cB8

    // $.ajax({
    // 	url: 'https://sheets.googleapis.com/v4/spreadsheets/12pqFnj8GHHvRAWOZhy9_ToGTlriSD6h4qgqokWBDXt4',
    // 	dataType: 'json',
    // 	type: 'GET',
    // 	data: {key: ''}
    // });

    // var settings_spreadsheet = {
    // 	url: 'https://sheets.googleapis.com/v4/spreadsheets/12pqFnj8GHHvRAWOZhy9_ToGTlriSD6h4qgqokWBDXt4',
    // 	type: 'GET',
    // 	dataType: 'json'
    // };

    // client.request(settings).then(function(data){
    // 	console.log(data);
    // },
    // function(response){
    // 	console.error(response);
    // });


    // var settings = {
    //     url: '/api/v2/users/' + id + '.json',
    //     type: 'GET',
    //     dataType: 'json'
    // };

    client.request(settings).then(function(data) {
    	console.log("data");
    	console.log(data);
    	data2 = data;
            showInfo(data2)
        },
        function(response) {
            showError(response);
        });
}
var client;
var data2;

$(function() {
    client = ZAFClient.init();
    //   client.get('ticket.assignee.user').then(function(data) {
    //   console.log(data['ticket.assignee.user']); // something like 29043265
    // });
    client.invoke('resize', {
        width: '100%',
        height: '120px'
    });
    client.get('ticket.requester.id').then(function(data) {
        var user_id = data['ticket.requester.id'];
        requestUserInfo(client, user_id);
    });

    // showInfo();
    //showError();


});