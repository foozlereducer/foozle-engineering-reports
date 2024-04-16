export default {
    files: [
      "tests/**/*.js",         // Include all test files in the backend test directory
      "!views/frontEnd/src/components/__test__/**"    // Exclude all tests in the frontend directory
    ],
    nodeArguments: [
      '--experimental-modules',
      '--no-warnings'
    ]
  };
  