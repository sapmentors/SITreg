describe("Login COORGANIZER", function() {
    it("should login COORGANIZER and get csrfToken", function() {
        csrfToken = getCSRFtokenAndLogin("COORGANIZER", password);
    });
});

describe("Change Homepage URL and read event as COORGANIZER", function() {
    it("should update the Homepage URL and check the change", function() {
        var xhr = prepareRequest("PATCH", eventUri);
        var HomepageURL = "http://www.sitmuc.de/";
        var change = {
            "HomepageURL": HomepageURL
        };
        xhr.send(JSON.stringify(change));
        expect(xhr.status).toBe(204);
        // Check MaxParticipants
        xhr = prepareRequest("GET", eventUri);
        xhr.send();
        var body = xhr.responseText ? JSON.parse(xhr.responseText) : "";
        expect(body.d.HomepageURL).toBe(HomepageURL);
    });
});

describe("Logout COORGANIZER", function() {
    it("should logout COORGANIZER", function() {
        logout(csrfToken);
        checkSession();
    });
});
