var helper = $.import("com.sap.sapmentors.sitreg.test.lib", "TestHelper");
var sitRegHelper = $.import("com.sap.sapmentors.sitreg.test.lib", "SITregHelper");
var parameters = $.import("com.sap.sapmentors.sitreg.test", "parameters");

var header;
var publicEventURI;

describe("Anonymous User", function() {
    it("should read events and return event details", function() {
		header = helper.prepareRequestHeader("");
        var url = "/com/sap/sapmentors/sitreg/odatapublic/service.xsodata/Events";
		var response = jasmine.callHTTPService(
			url,
			$.net.http.GET,
			undefined,
			header
		);
		expect(response.status).toBe(200);
		// jasmine.log(response.body.asString());
		var body = helper.getResponseBody(response);
		expect(body.d.results.length).toBeGreaterThan(1);
        publicEventURI = body.d.results[0].__metadata.uri;
    });

    it("should read participants of first event and return participant details but without EMail", function() {
        var url = publicEventURI + "/Participants";
		var response = jasmine.callHTTPService(
			url,
			$.net.http.GET,
			undefined,
			header
		);
		expect(response.status).toBe(200);
		// jasmine.log(response.body.asString());
		var body = helper.getResponseBody(response);
		expect(body.d.results[0].EMail).toBe(undefined);
    });

});