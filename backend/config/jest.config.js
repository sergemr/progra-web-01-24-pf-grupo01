module.exports = {
    moduleFileExtensions: ['js', 'json'], 
    testEnvironment: 'node',
    testRegex: 'test/.+\\.test\\.js$',
    coverageDirectory: '../test/coverage',
    collectCoverageFrom: ['**/*.js', '!**/node_modules/**'],
    rootDir: '..'
};
