    var client = ZAFClient.init();

    client.invoke('ticketFields:custom_field_77501888.hide').then(function() {
        return client.invoke('ticketFields:custom_field_77501908.hide').then(function() {

            return client.invoke('ticketFields:custom_field_77501928.hide').then(function() {
                return;
            })
        })
    });

    client.on('ticket.save', function(data) {

        return client.get('ticket.status').then(function(data) {
            if (data['ticket.status'] === 'solved') {
                return client.set('ticket.customField:custom_field_77501908', generateId(20)).then(function(data) {
                    //console.log(data);
                    return;
                });
            }
        });
    });

    requestAnnouncementsInfo();

    function showInfo(data) {

        var context = {};
        var rows = [];
        var array = [];

        Object.keys(data).forEach(function(key) {
            if (data[key].display === 1 || data[key].display === '1') {
                array.push({ title: data[key].title.replace('<br>', '\n'), detail: data[key].detail.replace('<br>', '\n'), id: key.toString() });
            }
        });

        rows.push(array[0]);


        /* Order data */
        for (var i = array.length - 1; i >= 1; i--) {
            rows.push(array[i]);
        }

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
            url: 'http://199.244.82.187:3000/announcement',
            type: 'GET',
            dataType: 'json'
        };

        client.request(settings).then(function(data) {
                showInfo(data);
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

    function dec2hex(dec) {
        return ('0' + dec.toString(16)).substr(-2)
    }

    // generateId :: Integer -> String
    function generateId(len) {
        var arr = new Uint8Array((len || 40) / 2)
        window.crypto.getRandomValues(arr)
        return Array.from(arr).map(dec2hex).join('')
    }
