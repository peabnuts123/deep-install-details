import { Result as PackageArg } from 'npm-package-arg';
import rimraf from 'rimraf';
import { promisify } from 'util';

const rimrafAsync = promisify(rimraf);

import processInstallInformation from '@app/processInstallInformation';
import setupNewPackage from '@app/setupNewPackage';
import { Package } from '@scrutiny/core';
import { Builder, execAsync, Logger, LogLevel, Timer } from '@scrutiny/core/util';

export default async function getPackagesInstalled(packageSpecifications: PackageArg[]): Promise<Builder<Package>[]> {
  // Map to a guaranteed well-formed package specification
  let packageDefinitions: string[] = packageSpecifications
    .map((packageArg: PackageArg) => {
      if (packageArg.type === 'git') {
        return `${packageArg.rawSpec}`;
      } else {
        return `${packageArg.name}@${packageArg.fetchSpec}`;
      }
    });

  Logger.log("Determining installed packages for `" + packageDefinitions.join(', ') + "`… ");

  // Execute `npm install`
  //  --dry-run specifies that packages are NOT actually installed
  //  --json makes `install` output the changes in a json parseable format
  let shellCommand = `npm install --dry-run --json ${packageDefinitions.join(' ')}`;

  // @TODO should validate these versions
  // Print out Node and NPM versions
  let nodeVersionString: string = await execAsync(`node -v`);
  Logger.log(`Node Version: ${nodeVersionString.trim()}`, LogLevel.debug);
  let npmVersionString = await execAsync(`npm -v`);
  Logger.log(`NPM Version: ${npmVersionString.trim()}`, LogLevel.debug);

  // @TODO support configurable project environments e.g. "What if installed into _THIS_ project"
  // Set up new package folder first
  const packageFolderName = 'processing-package';
  await setupNewPackage(packageFolderName);

  // Execute npm install command
  Logger.log(`Executing shell command: '${shellCommand}'`, LogLevel.debug);
  Timer.start('PackageInstall');
  let json = await execAsync(shellCommand);

  let elapsesTimeSeconds = Timer.stop('PackageInstall');
  Logger.log(`Finished determining installed packages (${elapsesTimeSeconds.toFixed(2)}s)`);

  // Clean up processing package
  process.chdir('..');
  await rimrafAsync(packageFolderName);

  // Parse the ASCII result into usable data
  let installInformation: NpmInstallOutput = JSON.parse(json);
  let packageInformation: Builder<Package>[] = processInstallInformation(installInformation);

  return packageInformation;
}