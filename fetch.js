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

    CreateHTTPObject.prototype.postBody = function() {
        return JSON.stringify({ 'decryptedData': this.body });
    }

    CreateHTTPObject.prototype.fetchDecryptedData = function(callback) {

        chrome.extension.sendMessage({ 'logact': 'scrolled' });

        // const xhr = new XMLHttpRequest();
        // xhr.open(this.method, this.url);
        // xhr.setRequestHeader("content-type", "application/json");

        // xhr.onload = function() {
        //     if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        //         const { decryptedData } = JSON.parse(this.responseText);
        //         callback(decryptedData);
        //     }
        // }

        // xhr.send(this.postBody());
    }

    sub.CreateHTTPObject = CreateHTTPObject;
    sub.HTTP_METHODS = HTTP_METHODS;

    return namesp;

}(UTIL || {}));