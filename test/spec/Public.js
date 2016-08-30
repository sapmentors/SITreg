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
var publicEventURI = "";

describe("Read events", function() {
    it("should return event details", function() {
        var url = "/com/sap/sapmentors/sitreg/odatapublic/service.xsodata/Events";
        var xhr = prepareRequest("GET", url);
        xhr.send();
        expect(xhr.status).toBe(200);
        var body = xhr.responseText ? JSON.parse(xhr.responseText) : "";
        expect(body.d.results.length).toBeGreaterThan(1);
        publicEventURI = body.d.results[0].__metadata.uri;
    });
});

describe("Read participants of first event", function() {
    it("should return participant details but without EMail", function() {
        var xhr = prepareRequest("GET", publicEventURI + "/Participants");
        xhr.send();
        expect(xhr.status).toBe(200);
        var body = xhr.responseText ? JSON.parse(xhr.responseText) : "";
        expect(body.d.results[0].EMail).toBe(undefined);
    });
});