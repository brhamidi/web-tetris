// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
	coverageDirectory: "./coverage/",

	collectCoverage: true,

	coveragePathIgnorePatterns: [
		"/node_modules/",
		"/\.git/"
	],
	testPathIgnorePatterns: [
		"/node_modules/"
	],
	transformIgnorePatterns: [
		"/node_modules/"
	],

	setupFilesAfterEnv: ["jest-enzyme"],

	testEnvironment: "enzyme"

};
