const fs = require("fs");
const path = require("path");
const APIException = require("./APIException");

class APIClient {

    constructor(baseUrl) {

        if (!baseUrl.endsWith("/")) {
            baseUrl += "/";
        }

        this.baseUrl = baseUrl;
        this.username = "";
        this.password = "";
    }

    //-------------------------
    // User
    //-------------------------

    getUser() {
        return this.username;
    }

    setUser(user) {
        this.username = user;
    }

    //-------------------------
    // Password
    //-------------------------

    getPassword() {
        return this.password;
    }

    setPassword(password) {
        this.password = password;
    }

    //-------------------------
    // GET
    //-------------------------

    async sendGet(uri, downloadPath = null) {
        return await this.sendRequest("GET", uri, downloadPath);
    }

    //-------------------------
    // POST
    //-------------------------

    async sendPost(uri, data = null) {
        return await this.sendRequest("POST", uri, data);
    }

    //-------------------------
    // Core Request
    //-------------------------

    async sendRequest(method, uri, data = null) {

        const url = this.baseUrl + uri;

        const headers = {
            Authorization:
                "Basic " +
                Buffer.from(
                    `${this.username}:${this.password}`
                ).toString("base64")
        };

        const options = {
            method,
            headers
        };

        //---------------------------------------
        // POST Request
        //---------------------------------------

        if (method === "POST") {

            // Attachment Upload

            if (uri.startsWith("add_attachment")) {

                const formData = new FormData();

                const fileBuffer = fs.readFileSync(data);

                formData.append(
                    "attachment",
                    new Blob([fileBuffer]),
                    path.basename(data)
                );

                options.body = formData;

            }

            // JSON Body

            else if (data) {

                headers["Content-Type"] = "application/json";

                options.body = JSON.stringify(data);

            }

        }

        //---------------------------------------
        // Execute Request
        //---------------------------------------

        const response = await fetch(url, options);

        //---------------------------------------
        // Download Attachment
        //---------------------------------------

        if (response.ok && uri.startsWith("get_attachment/")) {

            const buffer = Buffer.from(await response.arrayBuffer());

            fs.writeFileSync(data, buffer);

            return data;

        }

        //---------------------------------------
        // Parse Response
        //---------------------------------------

        const text = await response.text();

        let result = {};

        if (text) {

            try {

                result = JSON.parse(text);

            } catch {

                result = text;

            }

        }

        //---------------------------------------
        // Error Handling
        //---------------------------------------

        if (!response.ok) {

            let errorMessage = "No additional error message received";

            if (
                typeof result === "object" &&
                result !== null &&
                result.error
            ) {
                errorMessage = result.error;
            }

            throw new APIException(
                `TestRail API returned HTTP ${response.status} (${errorMessage})`,
                response.status,
                result
            );

        }

        return result;
    }

}

module.exports = APIClient;