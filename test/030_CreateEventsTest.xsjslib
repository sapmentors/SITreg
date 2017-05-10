var helper = $.import("com.sap.sapmentors.sitreg.test.lib", "TestHelper");
var parameters = $.import("com.sap.sapmentors.sitreg.test", "parameters");

var loginResult;
var header;

var eventIDcoOrganizer;
var eventUricoOrganizer;
var deviceID = "3549d56f-3552-4d6a-bcec-57b61aedb6f1";

function createEvent(Location, EventDate, StartTime, EndTime, Description, Type, Visible, MaxParticipants) {
    var service = "/com/sap/sapmentors/sitreg/odataorganizer/service.xsodata/Events";
    var eventID = 1;
    Description = Description || "SAP Inside Track";
    Type = Type || "I";
    Visible = Visible || "Y";
    MaxParticipants = MaxParticipants || 80;
    var create = {
        "ID": eventID,
        "Location": Location,
        "EventDate": EventDate,
        "StartTime": StartTime,
        "EndTime": EndTime,
        "MaxParticipants": MaxParticipants,
        "HomepageURL": null,
        "Description": Description,
        "Type": Type,
        "Visible": Visible
    };
    var response = jasmine.callHTTPService(service, $.net.http.POST, JSON.stringify(create), header, loginResult.cookies);
    expect(response.status).toBe($.net.http.CREATED);
    return response;
}

function addCoOrganizer(_EventID, _UserName) {
    var create = {
        "EventID": _EventID,
        "UserName": _UserName,
        "Active": "Y"
    };
    var service = "/com/sap/sapmentors/sitreg/odataorganizer/service.xsodata/CoOrganizers";
    var response = jasmine.callHTTPService(service, $.net.http.POST, JSON.stringify(create), header, loginResult.cookies);
    return response;
}

function addDevice(_EventID, _DeviceID) {
    var create = {
        "EventID": _EventID,
        "DeviceID": _DeviceID,
        "Active": "Y"
    };
    var service = "/com/sap/sapmentors/sitreg/odataorganizer/service.xsodata/Devices";
    var response = jasmine.callHTTPService(service, $.net.http.POST, JSON.stringify(create), header, loginResult.cookies);
    return response;
}

describe("Create Events", function() {

    it("should login ORGANIZER and get csrfToken", function() {
        loginResult = helper.getCSRFtokenAndLogin("ORGANIZER", helper.newpwd);
        header = helper.prepareRequestHeader(loginResult.csrf);
    });
    
    it("should create an event", function() {
        createEvent(
            "München",
            "/Date(1475798400000)/",
            "/Date(1475910000000)/",
            "/Date(1475942400000)/",
            "SAP Inside Track"
        );
        createEvent(
            "Bern",
            "/Date(1472774400000)/",
            "/Date(1472889600000)/",
            "/Date(1472911200000)/",
            "早上好"
        );

        createEvent(
            "SmallTown",
            "/Date(1472774400000)/",
            "/Date(1472889600000)/",
            "/Date(1472911200000)/",
            "",
            "",
            "Y",
            2
        );
    });

    it("should read the created events, change the MaxParticipants and check the change", function() {
        var response = jasmine.callHTTPService(parameters.readEventsService, $.net.http.GET, undefined, header, loginResult.cookies);
        expect(response.status).toBe($.net.http.OK);
        /*
        for (var i = 0; i < response.headers.length; ++i) {
            jasmine.log(response.headers[i].name + '": "' + response.headers[i].value);
        }
        jasmine.log(response.body.asString());
        */
		var body = helper.getResponseBody(response);
		for (var i = 0; i < body.d.results.length; ++i) {
            // jasmine.log(body.d.results[i].ID);
            addCoOrganizer(body.d.results[i].ID, "GWOLF");
            addCoOrganizer(body.d.results[i].ID, "S0001142741");
            response = addDevice(body.d.results[i].ID, deviceID);
            expect(response.status).toBe($.net.http.CREATED);
            eventIDcoOrganizer = body.d.results[i].ID;
            eventUricoOrganizer = body.d.results[i].__metadata.uri;
		}
        expect(body.d.results[0].Description).toBe("SAP Inside Track");
        /*
        // 
        // Jasmine seems to have encoding issues
        // München is returned as MÃ¼nchen
        // and 
        // 早上好 as æ©ä¸å¥½
        // But the actual content was created correctly in the DB
        //
        expect(body.d.results[0].Location).toBe("München");
        expect(body.d.results[1].Description).toBe("早上好");
        */
        // Change MaxParticipants
        var eventUri = body.d.results[0].__metadata.uri;
        var MaxParticipants = 90;
        var change = {
            "MaxParticipants": MaxParticipants
        };
        response = jasmine.callHTTPService(eventUri, $.net.http.PATCH, JSON.stringify(change), header, loginResult.cookies);
        expect(response.status).toBe(204); // No Content
        // Check MaxParticipants
        response = jasmine.callHTTPService(eventUri, $.net.http.GET, undefined, header, loginResult.cookies);
        expect(response.status).toBe($.net.http.OK);
		body = helper.getResponseBody(response);
        expect(body.d.MaxParticipants).toBe(MaxParticipants);
    });

    it("should add COORGANIZER to event", function() {
        // jasmine.log("Add CoOrganizer to EventID: " + eventIDcoOrganizer);
        var response = addCoOrganizer(eventIDcoOrganizer, "COORGANIZER");
        expect(response.status).toBe($.net.http.CREATED);
    });

    it("should read list of COORGANIZER's of an event", function() {
        var uri = eventUricoOrganizer + "/CoOrganizers";
        var response = jasmine.callHTTPService(uri, $.net.http.GET, undefined, header, loginResult.cookies);
		var body = helper.getResponseBody(response);
        expect(body.d.results[0].EventID).toBe(eventIDcoOrganizer);
        expect(body.d.results[0].UserName).toBe("COORGANIZER");
        expect(body.d.results[0].Active).toBe("Y");
    });
    
    it("should logout ORGANIZER", function() {
        helper.logout(loginResult.csrf, loginResult.cookies);
        helper.checkSession();
    });
});