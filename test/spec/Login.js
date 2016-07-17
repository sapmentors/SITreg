describe("Login", function() {
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

    function login(username) {
        var xhr = new XMLHttpRequest();
        var form = "xs-username=" + username + "&xs-password=Init1234";
        xhr.open("POST", "/sap/hana/xs/formLogin/login.xscfunc", false);
        xhr.setRequestHeader("X-CSRF-Token", "unsafe");
        xhr.send(form);
        expect(xhr.status).toBe(200);
        expect(xhr.statusText).toBe("OK");
        var body = xhr.responseText ? JSON.parse(xhr.responseText) : "";
        expect(body.login).toBe(true);
        expect(body.pwdChange).toBe(true);
    }
    
    function changePassword(username, csrf) {
        // Now let's change the password
        var xhr = new XMLHttpRequest();
        var form = "xs-password-old=Init1234&xs-password-new=" + password;
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
    
    function logout(csrf) {
        // Now logout
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/sap/hana/xs/formLogin/logout.xscfunc", false);
        xhr.setRequestHeader("X-CSRF-Token", csrf);
        xhr.send(null);
        expect(xhr.status).toBe(200);
        expect(xhr.statusText).toBe("OK");
    }
    
    it("should login users and change password", function() {
        for (var user in users){
            if(user) {
                checkSession();
                var csrfToken = getCSRFtoken();
                expect(csrfToken).toBe("unsafe");
                login(users[user]);
                csrfToken = getCSRFtoken();
                changePassword(users[user], csrfToken);
                logout(csrfToken);
            }
        }
    });
});