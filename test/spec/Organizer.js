describe("Login ORGANIZER", function() {
    it("should login ORGANIZER and get csrfToken", function() {
        checkSession();
        csrfToken = getCSRFtoken();
        expect(csrfToken).toBe("unsafe");
        login("ORGANIZER", password, csrfToken);
        csrfToken = getCSRFtoken();
    });
});

describe("Logout ORGANIZER", function() {
    it("should logout ORGANIZER", function() {
        logout(csrfToken);
        checkSession();
    });
});
