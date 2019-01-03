import { expect } from 'chai';

import processInstallInformation from '@app/processInstallInformation';
import { Package } from '@scrutiny/core';
import { Builder, ObjectBuilder } from '@scrutiny/core/util';

let sampleInput: NpmInstallOutput;
let sampleOutput: Builder<Package>[];

beforeEach(() => {
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

  let arrayDiffer: Builder<Package> = ObjectBuilder.create(Package.Assemble, {
    name: 'array-differ',
    version: '1.0.0',
  });
  let beeper: Builder<Package> = ObjectBuilder.create(Package.Assemble, {
    name: 'beeper',
    version: '1.1.1',
  });
  let clone102: Builder<Package> = ObjectBuilder.create(Package.Assemble, {
    name: 'clone',
    version: '1.0.2',
  });
  let clone100: Builder<Package> = ObjectBuilder.create(Package.Assemble, {
    name: 'clone',
    version: '1.0.0',
  });
  let cloneStats: Builder<Package> = ObjectBuilder.create(Package.Assemble, {
    name: 'clone-stats',
    version: '0.0.1',
  });
  let dateformat: Builder<Package> = ObjectBuilder.create(Package.Assemble, {
    name: 'dateformat',
    version: '2.0.0',
  });

  sampleOutput = [
    arrayDiffer,
    beeper,
    clone100,
    clone102,
    cloneStats,
    dateformat,
  ];
});

describe("processInstallInformation", () => {
  it("correctly parses mock input (deduplicate, ordering, parsing)", () => {
    // Test
    //  - process data
    let packageInfo: Builder<Package>[] = processInstallInformation(sampleInput);

    // Assert
    expect(packageInfo).to.deep.equal(sampleOutput);
  });
});
