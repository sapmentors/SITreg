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
var xssScript = "<script>alert('John');</script>";

describe("Login PARTICIPANT", function() {
    it("should login PARTICIPANT and get csrfToken", function() {
        csrfToken = getCSRFtokenAndLogin("PARTICIPANT", password);
    });
});

describe("Reqeust access as an Organizer", function() {
    it("should add UserName to Organizer Table", function() {
        var xhr = registerAsOrganizer("PARTICIPANT");
        expect(xhr.status).toBe(201);
        expect(xhr.statusText).toBe("Created");
    });
});

describe("Read values for relationship to SAP", function() {
    it("should return a list of possible relationships", function() {
        var xhr = setLocale("en");
        expect(xhr.status).toBe(200);
        var xhr = getRelationToSAP();
        var body = xhr.responseText ? JSON.parse(xhr.responseText) : "";
        expect(body.d.results.length).toBe(7);
        expect(body.d.results[0].Description).toBe("Customer");
    });
});

describe("Switch locale to de and read relationship to SAP again", function() {
    it("should return a list of possible relationships in German", function() {
        var xhr = setLocale("de");
        expect(xhr.status).toBe(200);
        xhr = getRelationToSAP();
        var body = xhr.responseText ? JSON.parse(xhr.responseText) : "";
        expect(body.d.results.length).toBe(7);
        expect(body.d.results[0].Description).toBe("Kunde");
    });
});

describe("Register as Participant", function() {
    it("should add UserName as an Participant of an Event", function() {
        var xhr = createParticipant(eventID , "PARTICIPANT");
        expect(xhr.status).toBe(201);
        expect(xhr.statusText).toBe("Created");
        // Register also for the second event
        // and let's test XSS Injection
        xhr = createParticipant(eventID2 , xssScript);
        expect(xhr.status).toBe(201);
        expect(xhr.statusText).toBe("Created");
    });
});

describe("Try to read organizer OData service as participant", function() {
    it("should not be possible", function() {
        var xhr = prepareRequest("GET", eventUri + "/Participant");
        xhr.send();
        expect(xhr.status).toBe(403);
    });
});

describe("Read event details and update pre-eventing event", function() {
    it("should provide participation details and update pre-evining event status", function() {
        var xhr = getParticipantDetailsForEvent(eventID);
        expect(xhr.status).toBe(200);
        var body = xhr.responseText ? JSON.parse(xhr.responseText) : "";
        expect(body.d.FirstName).toBe("PARTICIPANT");
        participantUrl = body.d.__metadata.uri;
        xhr = prepareRequest("PATCH", participantUrl);
        var change = {
            "PreEveningEvent": "Y"
        };
        xhr.send(JSON.stringify(change));
        expect(xhr.status).toBe(204);
        xhr = prepareRequest("GET", participantUrl);
        xhr.send();
        var body = xhr.responseText ? JSON.parse(xhr.responseText) : "";
        expect(body.d.PreEveningEvent).toBe("Y");
    });
});

describe("Read second event details where XSS was tried", function() {
    it("should provide participation details and XSS script should been escaped", function() {
        var xhr = getParticipantDetailsForEvent(eventID2);
        var body = xhr.responseText ? JSON.parse(xhr.responseText) : "";
        expect(body.d.FirstName).toBe(xssScript);
    });
});

describe("Logout PARTICIPANT", function() {
    it("should logout PARTICIPANT", function() {
        logout(csrfToken);
        checkSession();
    });
});
