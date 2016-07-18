describe("Login ORGANIZER", function() {
    it("should login ORGANIZER and get csrfToken", function() {
        checkSession();
        csrfToken = getCSRFtoken();
        expect(csrfToken).toBe("unsafe");
        login("ORGANIZER", password, csrfToken);
        csrfToken = getCSRFtoken();
    });
});

describe("Create event", function() {
    it("should create event", function() {
        var xhr = new XMLHttpRequest();
        var create = {
            "ID": 1,
            "Location": "München",
            "EventDate": "/Date(1475798400000)/",
            "StartTime": "/Date(1475910000000)/",
            "EndTime": "/Date(1475942400000)/",
            "MaxParticipants": 80,
            "HomepageURL": null
        };
        xhr.open("POST", "/com/sap/sapmentors/sitreg/odataorganizer/service.xsodata/Events", false);
        xhr.setRequestHeader("X-CSRF-Token", csrfToken);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(create));
        expect(xhr.status).toBe(201);
        expect(xhr.statusText).toBe("Created");
        var body = xhr.responseText ? JSON.parse(xhr.responseText) : "";
    });
});

describe("Logout ORGANIZER", function() {
    it("should logout ORGANIZER", function() {
        logout(csrfToken);
        checkSession();
    });
});
