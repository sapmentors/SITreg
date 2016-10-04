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

var TicketCodeURL = "/com/sap/sapmentors/sitreg/odatareceptionist/checkTicket.xsjs";
var ReceptionistODataURL = "/com/sap/sapmentors/sitreg/odatareceptionist/service.xsodata";

describe("Login RECEPTIONIST", function() {
    it("should login RECEPTIONIST and get csrfToken", function() {
        csrfToken = getCSRFtokenAndLogin("RECEPTIONIST", password);
    });
});

describe("Check provided ticket using HTTP POST", function() {
    it("should return the Event and Participant ID", function() {
        var check = {
            "SHA256HASH": SHA256HASH
        };
        var xhr = prepareRequest("POST", TicketCodeURL);
        xhr.send(JSON.stringify(check));
        expect(xhr.status).toBe(200);
        var body = xhr.responseText ? JSON.parse(xhr.responseText) : "";
        expect(body.OUTC[0].EventID).not.toBe(null);
    });
});

describe("Check provided ticket using HTTP GET", function() {
    it("should return the Event and Participant ID", function() {
        TicketCodeURL = TicketCodeURL + "?SHA256HASH=" + encodeURIComponent(SHA256HASH);
        var xhr = prepareRequest("GET", TicketCodeURL);
        xhr.send();
        expect(xhr.status).toBe(200);
        var body = xhr.responseText ? JSON.parse(xhr.responseText) : "";
        expect(body.OUTC[0].EventID).not.toBe(null);
    });
});

describe("Check in participant ticket", function() {
    it("should check in the participant", function() {
        var xhr =  prepareRequest("PATCH", ReceptionistODataURL + "/Ticket(" + participantID + ")");
        var change = {
            "SHA256HASH": SHA256HASH
        };
        xhr.send(JSON.stringify(change));
        expect(xhr.status).toBe(204);
    });
});

describe("Check that provided ticket was used", function() {
    it("should return no event ID", function() {
        var check = {
            "SHA256HASH": SHA256HASH
        };
        var xhr = prepareRequest("POST", TicketCodeURL);
        xhr.send(JSON.stringify(check));
        expect(xhr.status).toBe(200);
        var body = xhr.responseText ? JSON.parse(xhr.responseText) : "";
        expect(body.OUTC[0].TicketUsed).toBe('Y');
    });
});

describe("Check in participant manually", function() {
    it("should check in the participant manually", function() {
        var xhr =  prepareRequest("PATCH", ReceptionistODataURL + "/Ticket(" + participantIDmanual + ")");
        var change = {
            "TicketUsed": "M"
        };
        xhr.send(JSON.stringify(change));
        expect(xhr.status).toBe(204);
    });
});

describe("Check that manual checkin was fullfilled", function() {
    it("should return an M for manual checkin", function() {
        var check = {
            "ParticipantID": participantIDmanual
        }; 
        var xhr = prepareRequest("POST", TicketCodeURL);
        xhr.send(JSON.stringify(check));
        expect(xhr.status).toBe(200);
        var body = xhr.responseText ? JSON.parse(xhr.responseText) : "";
        expect(body.OUTC[0].TicketUsed).toBe('M');
    });
});

describe("Logout RECEPTIONIST", function() {
    it("should logout RECEPTIONIST", function() {
        logout(csrfToken);
        checkSession();
    });
});
