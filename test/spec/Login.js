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