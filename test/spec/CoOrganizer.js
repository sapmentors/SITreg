describe("Login COORGANIZER", function() {
    it("should login COORGANIZER and get csrfToken", function() {
        checkSession();
        csrfToken = getCSRFtoken();
        expect(csrfToken).toBe("unsafe");
        login("ORGANIZER", password, csrfToken);
        csrfToken = getCSRFtoken();
    });
});

describe("Logout COORGANIZER", function() {
    it("should logout COORGANIZER", function() {
        logout(csrfToken);
        checkSession();
    });
});