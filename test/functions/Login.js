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

function checkSession() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/sap/hana/xs/formLogin/checkSession.xsjs", false);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(null);
    expect(xhr.status).toBe(200);
    expect(xhr.statusText).toBe("OK");
    var body = xhr.responseText ? JSON.parse(xhr.responseText) : "";
    expect(body.login).toBe(false);
}

function getCSRFtoken() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/sap/hana/xs/formLogin/token.xsjs", false);
    xhr.setRequestHeader("X-CSRF-Token", "Fetch");
    xhr.send(null);
    expect(xhr.status).toBe(200);
    expect(xhr.statusText).toBe("OK");
    return xhr.getResponseHeader("x-csrf-token");
}

function login(username, pwd, csrf) {
    var xhr = new XMLHttpRequest();
    var form = "xs-username=" + username + "&xs-password=" + pwd;
    xhr.open("POST", "/sap/hana/xs/formLogin/login.xscfunc", false);
    xhr.setRequestHeader("X-CSRF-Token", csrf);
    xhr.send(form);
    expect(xhr.status).toBe(200);
    expect(xhr.statusText).toBe("OK");
    var body = xhr.responseText ? JSON.parse(xhr.responseText) : "";
    expect(body.login).toBe(true);
    if(!body.pwdChange) {
        expect(body.username).toBe(username);
    }
    return body;
}

function getCSRFtokenAndLogin(_username, _password) {
    checkSession();
    var _csrfToken = getCSRFtoken();
    expect(_csrfToken).toBe("unsafe");
    login(_username, _password, _csrfToken);
    return getCSRFtoken();
}

function setLocale(_locale) {
    var xhr = prepareRequest("POST", "/sap/hana/xs/formLogin/locale.xscfunc");
    var locale = {
        "locale": _locale
    };
    xhr.send(JSON.stringify(locale));
    return xhr;
}

function logout(csrf) {
    // Now logout
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/sap/hana/xs/formLogin/logout.xscfunc", false);
    xhr.setRequestHeader("X-CSRF-Token", csrf);
    xhr.send(null);
    expect(xhr.status).toBe(200);
    expect(xhr.statusText).toBe("OK");
}
