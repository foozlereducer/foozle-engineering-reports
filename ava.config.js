export default {
    files: [
      "tests/**/*.js",         // Include all test files in the backend test directory
      "plugins/**/tests/**/*.js", // Include all test files in any tests directory under plugins
      "!views/frontEnd/src/components/__test__/**"    // Exclude all tests in the frontend directory
    ],
    nodeArguments: [
      '--experimental-modules',
      '--no-warnings'
    ]
  };
  