describe("Teardown", function() {
    it("should delete users", function() {
        var xhr = prepareRequest("GET", "/com/sap/sapmentors/sitreg/test/teardown.xsjs");
        xhr.send();
        expect(xhr.status).toBe(200);
        expect(xhr.statusText).toBe("OK");
        var body = xhr.responseText ? JSON.parse(xhr.responseText) : "";
        expect(body.teardown).toBe(true);
    });
});
