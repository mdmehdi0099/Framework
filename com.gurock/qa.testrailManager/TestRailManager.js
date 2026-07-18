const APIClient = require("../testrail/APIClient");

class TestRailManager {

    constructor(baseUrl, username, password) {

        this.client = new APIClient(baseUrl);

        this.client.setUser(username);
        this.client.setPassword(password);

    }

    //-------------------------
    // Projects
    //-------------------------

    async getProject(projectId) {

        return await this.client.sendGet(
            `index.php?/api/v2/get_project/${projectId}`
        );

    }

    //-------------------------
    // Suites
    //-------------------------

    async getSuite(suiteId) {

        return await this.client.sendGet(
            `index.php?/api/v2/get_suite/${suiteId}`
        );

    }

    //-------------------------
    // Sections
    //-------------------------

    async getSections(projectId, suiteId) {

        return await this.client.sendGet(
            `index.php?/api/v2/get_sections/${projectId}&suite_id=${suiteId}`
        );

    }

    //-------------------------
    // Cases
    //-------------------------

    async getCase(caseId) {

        return await this.client.sendGet(
            `index.php?/api/v2/get_case/${caseId}`
        );

    }

    async getCases(projectId, suiteId) {

        return await this.client.sendGet(
            `index.php?/api/v2/get_cases/${projectId}&suite_id=${suiteId}`
        );

    }

    //-------------------------
    // Runs
    //-------------------------

    async getRun(runId) {

        return await this.client.sendGet(
            `index.php?/api/v2/get_run/${runId}`
        );

    }

    async createRun(projectId, data) {

        return await this.client.sendPost(
            `index.php?/api/v2/add_run/${projectId}`,
            data
        );

    }

    async closeRun(runId) {

        return await this.client.sendPost(
            `index.php?/api/v2/close_run/${runId}`
        );

    }

    async deleteRun(runId) {

        return await this.client.sendPost(
            `index.php?/api/v2/delete_run/${runId}`
        );

    }

    //-------------------------
    // Tests
    //-------------------------

    async getTests(runId) {

        return await this.client.sendGet(
            `index.php?/api/v2/get_tests/${runId}`
        );

    }

    //-------------------------
    // Results
    //-------------------------

    async addResult(testId, statusId, comment = "") {

        return await this.client.sendPost(
            `index.php?/api/v2/add_result/${testId}`,
            {
                status_id: statusId,
                comment
            }
        );

    }

    async addResultForCase(
        runId,
        caseId,
        statusId,
        comment = ""
    ) {

        return await this.client.sendPost(
            `index.php?/api/v2/add_result_for_case/${runId}/${caseId}`,
            {
                status_id: statusId,
                comment
            }
        );

    }

    async addResults(runId, results) {

        return await this.client.sendPost(
            `index.php?/api/v2/add_results/${runId}`,
            {
                results
            }
        );

    }

    //-------------------------
    // Milestone
    //-------------------------

    async getMilestone(milestoneId) {

        return await this.client.sendGet(
            `index.php?/api/v2/get_milestone/${milestoneId}`
        );

    }

}

module.exports = TestRailManager;