var helper = $.import("com.sap.sapmentors.sitreg.test.lib", "TestHelper");

describe("Setup Integration Test", function() {

	it("should setup the tests", function() {
		var response = jasmine.callHTTPService("/com/sap/sapmentors/sitreg/test/setup.xsjs");

		expect(response.status).toBe($.net.http.OK);

		var responseBody = helper.getResponseBody(response);
		expect(responseBody.setup).toBe(true);
	});

});