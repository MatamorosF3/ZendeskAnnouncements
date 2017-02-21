var client;
var data2;

$(function() {
    client = ZAFClient.init();

    // client.invoke('resize', {
    //     width: '100%',
    //     height: '120px'
    // });
    requestIssueInfo(client);
    // client.get('ticket.requester.id').then(function(data) {
    //     requestUserInfo(client);
    // });
});

function showInfo(data) {

    var context = {};
    var rows = [];

    for (i in data2) {
        rows.push({ organization: data2[i].ORGANIZATION, issue: data2[i].ISSUE, id: data2[i].ID });
    }

    context.items = rows;

    Handlebars.registerHelper('data_rows', function() {
        var issue = Handlebars.escapeExpression(this.issue),
            organization = Handlebars.escapeExpression(this.organization);
        return new Handlebars.SafeString(
            "<td><a onclick=getModal(" + this.id + ") style=cursor:pointer; >" + this.organization + "</a></td> <td>" + this.issue
        );
    });

    var source = $("#requester-template").html();
    var template = Handlebars.compile(source);
    var html = template(context);
    $("#content").html(html);
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

function requestIssueInfo(client) {

    var settings = {
        url: 'http://ec2-54-159-13-160.compute-1.amazonaws.com:9000/issue',
        type: 'GET',
        dataType: 'json'
    };

    client.request(settings).then(function(data) {
            data2 = data;
            showInfo(data2)
        },
        function(response) {
            showError();
        });
}
