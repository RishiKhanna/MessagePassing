var UTIL = (function(namesp) {

    var sub = namesp.string = namesp.string || {};

    const HTTP_METHODS = {
        POST: 'POST',
        GET: 'GET'
    };

    const CreateHTTPObject = function(url, method, body) {
        this.url = url;
        this.method = method;
        this.body = body
    }

    CreateHTTPObject.prototype.fetchDecryptedData = function(callback) {
        chrome.runtime.sendMessage(this, function(response) {
            callback(response);
        });
    }

    sub.CreateHTTPObject = CreateHTTPObject;
    sub.HTTP_METHODS = HTTP_METHODS;

    return namesp;

}(UTIL || {}));