const expect = require('chai').expect;
const Package = require('../src/lib/Package');
const processInstallInformation = require('../src/processInstallInformation');


let sampleInput, sampleOutput;
beforeEach(function () {
  sampleInput = JSON.parse(`{
    "added": [
      {
        "action": "add",
        "name": "array-differ",
        "version": "1.0.0",
        "path": "/Users/jeff/Documents/Projects/_misc/deep-install-details/node_modules/array-differ"
      },
      {
        "action": "add",
        "name": "beeper",
        "version": "1.1.1",
        "path": "/Users/jeff/Documents/Projects/_misc/deep-install-details/node_modules/beeper"
      },
      {
        "action": "add",
        "name": "clone",
        "version": "1.0.2",
        "path": "/Users/jeff/Documents/Projects/_misc/deep-install-details/node_modules/clone"
      },
      {
        "action": "add",
        "name": "clone-stats",
        "version": "0.0.1",
        "path": "/Users/jeff/Documents/Projects/_misc/deep-install-details/node_modules/clone-stats"
      },
      {
        "action": "add",
        "name": "dateformat",
        "version": "2.0.0",
        "path": "/Users/jeff/Documents/Projects/_misc/deep-install-details/node_modules/dateformat"
      },
      {
        "action": "add",
        "name": "dateformat",
        "version": "2.0.0",
        "path": "/Users/jeff/Documents/Projects/_misc/deep-install-details/node_modules/dateformat"
      },
      {
        "action": "add",
        "name": "clone",
        "version": "1.0.2",
        "path": "/Users/jeff/Documents/Projects/_misc/deep-install-details/node_modules/clone"
      },
      {
        "action": "add",
        "name": "clone",
        "version": "1.0.0",
        "path": "/Users/jeff/Documents/Projects/_misc/deep-install-details/node_modules/clone"
      }
    ],
    "removed": [],
    "updated": [],
    "moved": [],
    "failed": [],
    "warnings": [
      "gulp-babel@7.0.0 requires a peer of babel-core@6 || 7 || ^7.0.0-alpha || ^7.0.0-beta || ^7.0.0-rc but none was installed."
    ],
    "elapsed": 2642
  }`);

  let arrayDiffer = new Package('array-differ', '1.0.0');
  let beeper = new Package('beeper', '1.1.1');
  let clone102 = new Package('clone', '1.0.2');
  let clone100 = new Package('clone', '1.0.0');
  let cloneStats = new Package('clone-stats', '0.0.1');
  let dateformat = new Package('dateformat', '2.0.0');

  sampleOutput = [
    arrayDiffer,
    beeper,
    clone100,
    clone102,
    cloneStats,
    dateformat,
  ];
});

describe("processInstallInformation", function () {
  it("correctly parses mock input (dedupe, ordering, parsing)", function () {
    // Test
    //  - process data
    let packageInfo = processInstallInformation(sampleInput);

    // Assert
    expect(packageInfo).to.deep.equal(sampleOutput);
  });
});
