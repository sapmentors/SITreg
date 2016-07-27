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

describe("Login", function() {

    function changePassword(username, pwd, csrf) {
        // Now let's change the password
        var xhr = new XMLHttpRequest();
        var form = "xs-password-old=Init1234&xs-password-new=" + pwd;
        xhr.open("POST", "/sap/hana/xs/formLogin/pwchange.xscfunc", false);
        xhr.setRequestHeader("X-CSRF-Token", csrf);
        xhr.send(form);
        expect(xhr.status).toBe(200);
        expect(xhr.statusText).toBe("OK");
        var body = xhr.responseText ? JSON.parse(xhr.responseText) : "";
        expect(body.login).toBe(true);
        expect(body.pwdChange).toBe(false);
        expect(body.username).toBe(username);
    }
    
    it("should login users and change password", function() {
        for (var user in users){
            if(user) {
                checkSession();
                var csrfToken = getCSRFtoken();
                expect(csrfToken).toBe("unsafe");
                var body = login(users[user], initpwd, csrfToken);
                expect(body.pwdChange).toBe(true);
                csrfToken = getCSRFtoken();
                changePassword(users[user], password, csrfToken);
                logout(csrfToken);
            }
        }
    });
});
