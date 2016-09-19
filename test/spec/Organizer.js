/*

   Copyright 2016 SAP Mentors

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

*/

describe("Login ORGANIZER", function() {
    it("should login ORGANIZER and get csrfToken", function() {
        csrfToken = getCSRFtokenAndLogin("ORGANIZER", password);
    });
});

describe("Create event", function() {
    it("should create event", function() {
        var xhr = createEvent(
            "München",
            "/Date(1475798400000)/",
            "/Date(1475910000000)/",
            "/Date(1475942400000)/"
        );
        expect(xhr.status).toBe(201);
        expect(xhr.statusText).toBe("Created");
        xhr = createEvent("");
        var xhr = createEvent(
            "Bern",
            "/Date(1472774400000)/",
            "/Date(1472889600000)/",
            "/Date(1472911200000)/"
        );
        expect(xhr.status).toBe(201);
        expect(xhr.statusText).toBe("Created");
        
        var xhr = createVerySmallEvent(
            "SmallTown",
            "/Date(1472774400000)/",
            "/Date(1472889600000)/",
            "/Date(1472911200000)/"
        );
        expect(xhr.status).toBe(201);
        expect(xhr.statusText).toBe("Created");
    });
});

describe("Read event and change MaxParticipants", function() {
    it("should return the created event, change the MaxParticipants and check the change", function() {
        var url = "/com/sap/sapmentors/sitreg/odataorganizer/service.xsodata/Events?$filter=History.CreatedBy eq 'ORGANIZER'";
        var xhr = prepareRequest("GET", url);
        xhr.send();
        expect(xhr.status).toBe(200);
        expect(xhr.statusText).toBe("OK");
        var body = xhr.responseText ? JSON.parse(xhr.responseText) : "";
        expect(body.d.results[0].Location).toBe("München");
        // Change MaxParticipants
        eventUri = body.d.results[0].__metadata.uri;
        eventUri2 = body.d.results[1].__metadata.uri;
        eventID2 = body.d.results[1].ID;
        eventIDsmall = body.d.results[2].ID;
        eventUrismall = body.d.results[2].__metadata.uri;
        xhr = xhr = updateEvent(eventUri);
        expect(xhr.status).toBe(204);
        // Check MaxParticipants
        xhr = prepareRequest("GET", eventUri);
        xhr.send();
        body = xhr.responseText ? JSON.parse(xhr.responseText) : "";
        expect(body.d.MaxParticipants).toBe(MaxParticipants);
        eventID = body.d.ID;
    });
});

describe("Add COORGANIZER to event", function() {
    it("should add COORGANIZER to event", function() {
        var xhr = addCoOrganizer(eventID, "COORGANIZER");
        expect(xhr.status).toBe(201);
        expect(xhr.statusText).toBe("Created");
    });
});

describe("Add additional co-organizers to event", function() {
    it("should add additional co-organizers to event", function() {
        var xhr = addCoOrganizer(eventID, "XSA_DEV");
        expect(xhr.status).toBe(201);
        expect(xhr.statusText).toBe("Created");
        xhr = addCoOrganizer(eventID, "GWOLF");
        xhr = addCoOrganizer(eventID, "S0001142741");
        xhr = addCoOrganizer(eventIDsmall, "S0001142741");
        xhr = addCoOrganizer(eventIDsmall, "COORGANIZER");
    });
});

describe("Read COORGANIZER's of event", function() {
    it("should read list of COORGANIZER's of an event", function() {
        var uri = eventUri + "/CoOrganizers";
        var xhr = prepareRequest("GET", uri);
        xhr.send();
        body = xhr.responseText ? JSON.parse(xhr.responseText) : "";
        expect(body.d.results[0].EventID).toBe(eventID);
        expect(body.d.results[0].UserName).toBe("COORGANIZER");
        expect(body.d.results[0].Active).toBe("Y");
    });
});

describe("Logout ORGANIZER", function() {
    it("should logout ORGANIZER", function() {
        logout(csrfToken);
        checkSession();
    });
});
