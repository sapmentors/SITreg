var helper = $.import("com.sap.sapmentors.sitreg.test.lib", "TestHelper");

describe("Teardown Integration Test", function() {

	it("should teardown tests", function() {
		var response = jasmine.callHTTPService("/com/sap/sapmentors/sitreg/test/teardown.xsjs");
		expect(response.status).toBe($.net.http.OK);

		var responseBody = helper.getResponseBody(response);
		expect(responseBody.teardown).toBe(true);
	});

});