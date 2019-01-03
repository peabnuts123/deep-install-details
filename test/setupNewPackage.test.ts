import { expect } from 'chai';
import fs from 'fs';

import setupNewPackage from '@app/setupNewPackage';
import { execAsync } from '@scrutiny/core/util';

describe('setupNewPackage', () => {
  it('[INTEGRATION] [ASYNC] correctly sets up a new package', async () => {
    // Setup
    const packageName: string = `test-package`;
    const removePackageAsync = () => {
      return execAsync(`rm -rf ${packageName}`);
    };

    // Test (ASYNC)
    try {
      // Set up package
      await setupNewPackage(packageName);

      // Assert package is set up
      expect(process.cwd().endsWith(packageName)).to.be.true;
      expect(fs.existsSync('./package.json')).to.be.true;

      // Move back up a dir
      process.chdir('../');

      // Clean up test
      await removePackageAsync();

      // Assert clean-up succeeded
      expect(fs.existsSync(packageName)).to.be.false;
    } catch (err) {
      console.error("Test Failed");

      // Something failed, attempt to clean up
      await removePackageAsync();

      // Fail test
      return Promise.reject('Test Failed');
    }
  });
});