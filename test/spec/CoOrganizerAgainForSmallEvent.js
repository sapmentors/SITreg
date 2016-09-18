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

describe("Read number of free seats fro small event", function() {
    it("should return one free seat", function() {
        var xhr = getRegistrationNumbersForEvent(eventIDsmall);
        var body = xhr.responseText ? JSON.parse(xhr.responseText) : "";
        expect(body.d.Free).toBe(1);
    });
});

xdescribe("Update Co-Organizers participation to Yes", function() {
    it("should change the registration status to waiting list", function() {
        var change = {
            "RSVP": "Y"
        };
        var updateResult = updateParticipant(eventIDsmall, change);
        expect(updateResult.xhr.status).toBe(204);
        var xhr = prepareRequest("GET", updateResult.participantUrl);
        xhr.send();
        var body = xhr.responseText ? JSON.parse(xhr.responseText) : "";
        expect(body.d.RSVP).toBe("W");
    });
});

describe("Logout COORGANIZER", function() {
    it("should logout COORGANIZER", function() {
        logout(csrfToken);
        checkSession();
    });
});
