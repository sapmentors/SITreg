describe("Login COORGANIZER", function() {
    it("should login COORGANIZER and get csrfToken", function() {
        csrfToken = getCSRFtokenAndLogin("COORGANIZER", password);
    });
});

describe("Logout COORGANIZER", function() {
    it("should logout COORGANIZER", function() {
        logout(csrfToken);
        checkSession();
    });
});