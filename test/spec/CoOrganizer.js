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

describe("Change Homepage URL and read event as COORGANIZER", function() {
    it("should update the Homepage URL and check the change", function() {
        var xhr = updateEvent(eventUri);
        expect(xhr.status).toBe(204);
        // Check MaxParticipants
        xhr = prepareRequest("GET", eventUri);
        xhr.send();
        var body = xhr.responseText ? JSON.parse(xhr.responseText) : "";
        expect(body.d.MaxParticipants).toBe(MaxParticipants);
    });
});

describe("Change data of an event where the COORGANIZER is not listed as a co-organizer", function() {
    it("should not be possible", function() {
        var xhr = xhr = updateEvent(eventUri2);
        expect(xhr.status).toBe(400);
    });
});

describe("Register as Participant MaxAttendees overflow routes to RSVP=W for waiting", function() {
    it("should add Two users as Participants of a SmallEvent one made it, one needs to wait", function() {
        var xhr = createParticipant(eventIDsmall , "Co Organizer Yeah", 3);
        expect(xhr.status).toBe(201);
        expect(xhr.statusText).toBe("Created");
    });
});

describe("Logout COORGANIZER", function() {
    it("should logout COORGANIZER", function() {
        logout(csrfToken);
        checkSession();
    });
});
