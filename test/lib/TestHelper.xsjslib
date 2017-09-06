var newpwd = "Test1234";

function checkSession() {
    var service = '/sap/hana/xs/formLogin/checkSession.xsjs';
    var contentTypeHeader = {
        "Content-Type": "application/json"
    };
    var response = jasmine.callHTTPService(service, $.net.http.GET, "", contentTypeHeader);

    expect(response.status).toBe($.net.http.OK);

    var body = JSON.parse( response.body ? response.body.asString() : "" );
    expect(body.login).toBe(false);
}

function getCSRFtoken(cookies) {
    var service = '/sap/hana/xs/formLogin/token.xsjs';
    var contentTypeHeader = {
        "X-CSRF-Token": "Fetch"
    };
    var response = jasmine.callHTTPService(service, $.net.http.GET, "", contentTypeHeader, cookies);

    expect(response.status).toBe($.net.http.OK);
    return response.headers.get('x-csrf-token');
}

function tupelListToObject(tupelList) {
    var sObject = "{";
    for (var i = 0; i < tupelList.length; ++i) {
        if(i > 0) {
            sObject += ',';
        }
        sObject += '"' + tupelList[i].name + '": "' + tupelList[i].value + '"';
    }
    sObject += "}";
    return JSON.parse(sObject);
}

function login(username, pwd, csrf) {
    var service = '/sap/hana/xs/formLogin/login.xscfunc';
    var contentTypeHeader = {
        "X-CSRF-Token": csrf
    };
    var form = "xs-username=" + username + "&xs-password=" + pwd;
    var response = jasmine.callHTTPService(service, $.net.http.POST, form, contentTypeHeader);
    expect(response.status).toBe($.net.http.OK);

    var body = JSON.parse( response.body ? response.body.asString() : "" );
    expect(body.login).toBe(true);
    if(!body.pwdChange) {
        expect(body.username).toBe(username);
    }
    var cookies = tupelListToObject(response.cookies);
    csrf = getCSRFtoken(cookies);
    return { "body": body, "cookies": cookies, "csrf": csrf };
}

function getCSRFtokenAndLogin(_username, _password) {
    checkSession();
    var _csrfToken = getCSRFtoken();
    expect(_csrfToken).toBe("unsafe");
    return login(_username, _password, _csrfToken);
}

function changePassword(username, oldpwd, newpwd, csrf, cookies) {
    var service = '/sap/hana/xs/formLogin/pwchange.xscfunc';
    var contentTypeHeader = {
        "X-CSRF-Token": csrf
    };
    var form = "xs-password-old=" + oldpwd + "&xs-password-new=" + newpwd;
    var response = jasmine.callHTTPService(service, $.net.http.POST, form, contentTypeHeader, cookies);
    expect(response.status).toBe($.net.http.OK);

    var body = JSON.parse( response.body ? response.body.asString() : "" );
    expect(body.login).toBe(true);
    expect(body.pwdChange).toBe(false);
    expect(body.username).toBe(username);
}

function logout(csrf, cookies) {
    var service = '/sap/hana/xs/formLogin/logout.xscfunc';
    var contentTypeHeader = {
        "X-CSRF-Token": csrf
    };
    var response = jasmine.callHTTPService(service, $.net.http.POST, "", contentTypeHeader, cookies);
    expect(response.status).toBe($.net.http.OK);
}

function prepareRequestHeader(csrfToken) {
    var requestHeader = {
        "X-CSRF-Token": csrfToken,
        "Accept": "application/json",
        "Content-Type": "application/json; charset=utf-8"
    };
    return requestHeader;
}

function getResponseBody(response) {
	var body = response.body ? response.body.asString() : "";
	return JSON.parse(body);
}
