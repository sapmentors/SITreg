describe("Login COORGANIZER", function() {
    it("should login COORGANIZER and get csrfToken", function() {
        csrfToken = getCSRFtokenAndLogin("COORGANIZER", password);
    });
});

describe("Read participant details of event 1", function() {
    it("should return participant details", function() {
        var participantUri = eventUri + "/Participants";
        var xhr = prepareRequest("GET", participantUri);
        xhr.send();
        expect(xhr.status).toBe(200);
        var body = xhr.responseText ? JSON.parse(xhr.responseText) : "";
        expect(body.d.results.length).toBe(1);
        expect(body.d.results[0].EMail).toBe(EMail);
    });
});

describe("Try to read participant details of event 2", function() {
    it("should not be possible", function() {
        var participantUri = eventUri2 + "/Participants";
        var xhr = prepareRequest("GET", participantUri);
        xhr.send();
        expect(xhr.status).toBe(200);
        var body = xhr.responseText ? JSON.parse(xhr.responseText) : "";
        expect(body.d.results.length).toBe(0);
    });
});

describe("Logout COORGANIZER", function() {
    it("should logout COORGANIZER", function() {
        logout(csrfToken);
        checkSession();
    });
});
