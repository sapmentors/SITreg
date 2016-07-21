describe("Login PARTICIPANT", function() {
    it("should login PARTICIPANT and get csrfToken", function() {
        csrfToken = getCSRFtokenAndLogin("PARTICIPANT", password);
    });
});

describe("Register as Organizer", function() {
    it("should add UserName to RegisterAsOrganizerQueue Table", function() {
        var xhr = registerAsOrganizer("PARTICIPANT");
        expect(xhr.status).toBe(201);
        expect(xhr.statusText).toBe("Created");

    });
});

describe("Logout PARTICIPANT", function() {
    it("should logout PARTICIPANT", function() {
        logout(csrfToken);
        checkSession();
    });
});