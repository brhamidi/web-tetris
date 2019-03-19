// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
	coveragePathIgnorePatterns: [
		"/node_modules/",
		"/\.git/"
	],
	coverageThreshold: {
		"./src/": {
			"branches": 50,
			"functions": 70,
			"lines": 70,
			"statements": 70
		}
	},

	testPathIgnorePatterns: [
		"/node_modules/"
	],
	transformIgnorePatterns: [
		"/node_modules/"
	],

	setupFilesAfterEnv: ["jest-enzyme"],

	testEnvironment: "enzyme"

};
