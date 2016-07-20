describe("Setup", function() {
    it("should clear DB, create users and assign roles", function() {
        var xhr = prepareRequest("GET", "/com/sap/sapmentors/sitreg/test/setup.xsjs");
        xhr.send();
        expect(xhr.status).toBe(200);
        expect(xhr.statusText).toBe("OK");
        var body = xhr.responseText ? JSON.parse(xhr.responseText) : "";
        expect(body.setup).toBe(true);
    });
});
