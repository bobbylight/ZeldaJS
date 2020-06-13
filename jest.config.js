module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  // A map from regular expressions to module names so our '@' root alias is known to Jest
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1"
  }
};
