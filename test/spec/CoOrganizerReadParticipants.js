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

describe("Update Participation to No", function() {
    it("should change the registration status and confirm the first on the waiting list", function() {
        var xhr = getParticipantDetailsForEvent(eventIDsmall);
        var body = xhr.responseText ? JSON.parse(xhr.responseText) : "";
        var participantUrl = body.d.__metadata.uri;
        xhr = prepareRequest("PATCH", participantUrl);
        var change = {
            "RSVP": "N"
        };
        xhr.send(JSON.stringify(change));
        expect(xhr.status).toBe(204);
        xhr = prepareRequest("GET", participantUrl);
        xhr.send();
        var body = xhr.responseText ? JSON.parse(xhr.responseText) : "";
        expect(body.d.RSVP).toBe("N");
    });
});

describe("Logout COORGANIZER", function() {
    it("should logout COORGANIZER", function() {
        logout(csrfToken);
        checkSession();
    });
});
