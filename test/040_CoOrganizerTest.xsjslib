var helper = $.import("com.sap.sapmentors.sitreg.test.lib", "TestHelper");
var parameters = $.import("com.sap.sapmentors.sitreg.test", "parameters");

var loginResult;
var header;

describe("Co-Organizer", function() {

    it("should login COORGANIZER and get csrfToken", function() {
        loginResult = helper.getCSRFtokenAndLogin("COORGANIZER", helper.newpwd);
        header = helper.prepareRequestHeader(loginResult.csrf);
    });

    it("should update the Homepage URL and check the change", function() {
        var response = jasmine.callHTTPService(parameters.readEventsService, $.net.http.GET, undefined, header, loginResult.cookies);
        expect(response.status).toBe($.net.http.OK);
		var body = helper.getResponseBody(response);
		for (var i = 0; i < body.d.results.length; ++i) {
		    
		}
    });

    it("should logout COORGANIZER", function() {
        helper.logout(loginResult.csrf, loginResult.cookies);
        helper.checkSession();
    });
});