function prepareRequest(method, url) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url, false);
    xhr.setRequestHeader("X-CSRF-Token", csrfToken);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    return xhr;
}

function createEvent(Location) {
    var create = {
        "ID": eventID,
        "Location": Location,
        "EventDate": "/Date(1475798400000)/",
        "StartTime": "/Date(1475910000000)/",
        "EndTime": "/Date(1475942400000)/",
        "MaxParticipants": 80,
        "HomepageURL": null
    };
    var xhr = prepareRequest("POST", "/com/sap/sapmentors/sitreg/odataorganizer/service.xsodata/Events");
    xhr.send(JSON.stringify(create));
    return xhr;
}

function registerAsOrganizer(UserName) {
    var register = {
        "UserName"           : UserName,
        "Status"             : "P", // Pending
	    "RequestTimeStamp"   : "/Date(1475942400000)/",
	    "StatusSetTimeStamp" : "/Date(1475942400000)/",
	    "History.CreatedBy"  : UserName,
	    "History.CreatedAt"  : "/Date(1475942400000)/",
	    "History.ChangedBy"  : UserName,
	    "History.ChangedAt"  : "/Date(1475942400000)/"
    };
    var xhr = prepareRequest("POST", "/com/sap/sapmentors/sitreg/odataparticipant/service.xsodata/RegisterAsOrganizer");
    xhr.send(JSON.stringify(register));
    return xhr;
}