var helper = $.import("com.sap.sapmentors.sitreg.test.lib", "TestHelper");

var loginResult;
var header;

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
            1
        );
    });

    it("should read the created events, change the MaxParticipants and check the change", function() {
        var service = encodeURI("/com/sap/sapmentors/sitreg/odataorganizer/service.xsodata/Events?$filter=History.CreatedBy eq 'ORGANIZER'");
        var response = jasmine.callHTTPService(service, $.net.http.GET, undefined, header, loginResult.cookies);
        expect(response.status).toBe($.net.http.OK);
        /*
        for (var i = 0; i < response.headers.length; ++i) {
            jasmine.log(response.headers[i].name + '": "' + response.headers[i].value);
        }
        jasmine.log(response.body.asString());
        */
		var body = helper.getResponseBody(response);
        expect(body.d.results[0].Description).toBe("SAP Inside Track");
        /*
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
    
    it("should logout ORGANIZER", function() {
        helper.logout(loginResult.csrf, loginResult.cookies);
        helper.checkSession();
    });
});