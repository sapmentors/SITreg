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
describe("Login PARTICIPANT", function() {
    it("should login PARTICIPANT and get csrfToken", function() {
        csrfToken = getCSRFtokenAndLogin("PARTICIPANT", password);
    });
});

describe("Check that Participant is now confirmed for small event", function() {
    it("should that Participant isn't anymore on the waiting list", function() {
        var xhr = getParticipantDetailsForEvent(eventIDsmall);
        var body = xhr.responseText ? JSON.parse(xhr.responseText) : "";
        expect(body.d.RSVP).toBe("Y");
    });
});

describe("Update Participant's participation to No", function() {
    it("should change the registration status and not result into an error when no one is on the waiting list", function() {
        var change = {
            "RSVP": "N"
        };
        var updateResult = updateParticipant(eventIDsmall, change);
        expect(updateResult.xhr.status).toBe(204);
        var xhr = prepareRequest("GET", updateResult.participantUrl);
        xhr.send();
        var body = xhr.responseText ? JSON.parse(xhr.responseText) : "";
        expect(body.d.RSVP).toBe("N");
        // Check free places
        xhr = getRegistrationNumbersForEvent(eventIDsmall);
        body = xhr.responseText ? JSON.parse(xhr.responseText) : "";
        expect(body.d.Free).toBe(1);
        // Change back to Registered
        change.RSVP = "Y";
        updateResult = updateParticipant(eventIDsmall, change);
        expect(updateResult.xhr.status).toBe(204);
        xhr = prepareRequest("GET", updateResult.participantUrl);
        xhr.send();
        var body = xhr.responseText ? JSON.parse(xhr.responseText) : "";
        expect(body.d.RSVP).toBe("Y");
    });
});

describe("Logout PARTICIPANT", function() {
    it("should logout PARTICIPANT", function() {
        logout(csrfToken);
        checkSession();
    });
});
