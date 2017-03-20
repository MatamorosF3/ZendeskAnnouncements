    var client = ZAFClient.init();
    requestAnnouncementsInfo();

    function showInfo(data) {

        var context = {};
        var rows = [];

        Object.keys(data).forEach(function(key) {
            if (data[key].display === 1 || data[key].display === '1') {
                rows.push({ title: data[key].title.replace('<br>', '\n'), detail: data[key].detail.replace('<br>', '\n'), id: key.toString() });
            }
        });

        context.items = rows;
        Handlebars.registerHelper('data_rows', function() {
            var detail = Handlebars.escapeExpression(this.detail),
                title = Handlebars.escapeExpression(this.title);
            return new Handlebars.SafeString(
                "<td><a onclick=getModal('" + this.id.toString() + "') style=cursor:pointer; >" + this.title + "</a></td> <td>" + this.detail
            );
        });

        

        var source = $("#announcements-template").html();
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

    function requestAnnouncementsInfo() {

        var settings = {
            url: 'http://ec2-52-40-155-63.us-west-2.compute.amazonaws.com:3000/announcement',
            type: 'GET',
            dataType: 'json'
        };

        client.request(settings).then(function(data) {
                showInfo(data)
            },
            function(response) {
                showError();
            });
    }

    function getModal(id) {

        localStorage.setItem('id', id);
        client.invoke('instances.create', {
            location: 'modal',
            url: "assets/showAnnouncement.html"
        }).then(function(modalContext) {

            var modalClient = client.instance(modalContext['instances.create'][0].instanceGuid);

            modalClient.invoke('resize', {
                width: '80vw',
                height: '80vh'
            });

            modalClient.on('announcementUpdated', function(data) {
                requestAnnouncementsInfo();
                Materialize.toast('Announcement updated.', 3000, 'rounded');
            });
        });
    }


    function getModalCreateAnnouncement() {

        client.invoke('instances.create', {
            location: 'modal',
            url: "assets/createAnnouncement.html"
        }).then(function(modalContext) {
            var modalClient = client.instance(modalContext['instances.create'][0].instanceGuid);


            modalClient.invoke('resize', {
                width: '80vw',
                height: '80vh'
            });

            modalClient.on('modal.close', function() {

                console.log("Modal is closed");
            });

            modalClient.on('announcementCreated', function() {
                Materialize.toast('Announcement created.', 3000, 'rounded');
                requestAnnouncementsInfo();
            });

        });

    }
