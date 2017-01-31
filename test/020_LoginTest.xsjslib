var helper = $.import("com.sap.sapmentors.sitreg.test.lib", "TestHelper");

describe("Login Users", function() {

	it("should detect that there is no session active", function() {
		helper.checkSession();
	});

	it("should get CSRF token", function() {
		var sCSRFtoken = helper.getCSRFtoken();
		expect(sCSRFtoken).toBe('unsafe');
	});

    it("should login users and change password", function() {
        var users = [
                "ORGANIZER",
                "COORGANIZER",
                "PARTICIPANT",
                "RECEPTIONIST"
            ];
        var initpwd  = "Init1234";
        for (var user in users){
            if(user) {
                helper.checkSession();
                var csrfToken = helper.getCSRFtoken();
                expect(csrfToken).toBe("unsafe");
                // jasmine.log("Login as: " + users[user]);
                var loginResult = helper.login(users[user], initpwd, csrfToken);
                expect(loginResult.body.pwdChange).toBe(true);
                csrfToken = helper.getCSRFtoken(loginResult.cookies);
                helper.changePassword(users[user], initpwd, helper.newpwd, csrfToken, loginResult.cookies);
                helper.logout(csrfToken, loginResult.cookies);
            }
        }
    });
});