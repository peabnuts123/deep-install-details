import _ from 'lodash';
import Registry from 'npm-registry';
import ProgressBar from 'progress';

import BuilderHelper from '@app/lib/BuilderHelper';
import Logger, { LogLevel } from '@app/lib/Logger';
import Package, { IPackageDetails } from '@app/lib/Package';

const npm = new Registry({
  registry: 'https://registry.npmjs.org',
});

const QUERY_INTERVAL_MS: number = 100;

export default function populatePackageDetails(packages: Partial<Package>[]): Promise<Package[]> {
  let packageIndex: number = 0;
  let totalPackages: number = packages.length;
  let progressBar: ProgressBar = new ProgressBar('[:bar] :percent (:etas remaining…)', {
    clear: true,
    total: totalPackages,
    width: 20,
    callback() {
      Logger.log("Finished!");
    },
  });

  Logger.log(`Fetching details for ${totalPackages} package${totalPackages > 1 ? 's' : ''}…`);


  // Return a promise that will resolve once ALL details of every package has been fetched
  // @TODO make this async I think
  return new Promise<Package[]>((mainResolve, mainReject) => {
    let allPromises: Promise<Package>[] = [];

    // Perform 1 request every QUERY_INTERVAL_MS milliseconds
    let intervalKey: NodeJS.Timer = setInterval(() => {
      // Clone the package and resolve anew
      let newPackage: Partial<Package> = packages[packageIndex++];

      // Enqueue a promise for this package's details
      allPromises.push(new Promise<Package>((resolve) => {
        // Query the NPM registry for this package
        npm.packages.details(newPackage.name as string, (error: string, data: any[]) => {
          if (Logger.testLevel(LogLevel.normal)) {
            progressBar.tick();
          }

          if (error) {
            // Oh noes, the npm registry had problems :/
            newPackage.hasError = true;
            newPackage.error = error;
          } else {
            // Map / parse package details into something useful
            newPackage.details = parsePackageDetails(data[0], newPackage.version as string);
          }

          // Resolve promise with the current package
          resolve(BuilderHelper.Assemble(newPackage, Package));
        });
      }));

      // Check if we've processed all of the packages
      if (packageIndex >= packages.length) {
        clearInterval(intervalKey);

        // this promise is done when all of these promises are done
        //  this has to be done with 2 promises because the task of
        //  collating the promises is async in itself (using setInterval)
        Promise.all(allPromises)
          .then(mainResolve)
          .catch(mainReject);
      }
    }, QUERY_INTERVAL_MS);
  });
}

function parsePackageDetails(details: any, version: string): IPackageDetails {
  // Get raw details from object, things that are relatively certain
  let packageDetails: Partial<IPackageDetails> = BuilderHelper.New<IPackageDetails>();

  // let packageDetails:  = {
  // Publish Date
  packageDetails.publishDate = details.time[version] ? new Date(details.time[version]) : null;

  // Publish Author
  let releaseInfo = details.releases[version];
  packageDetails.publishAuthor = _.isObject(releaseInfo) ? `${releaseInfo.name} (${releaseInfo.email})` : null;
  packageDetails.version = version;
  // @TODO do something with dependencies
  // packageDetails.dependencies = _.reduce(details.versions[version].dependencies, function (current, value, key) {
  //   current.push({ version: value, name: key });
  //   return current;
  // }, []);
  // packageDetails.devDependencies = _.reduce(details.versions[version].devDependencies, function (current, value, key) {
  //   current.push({ version: value, name: key });
  //   return current;
  // }, []);

  // Attempt to pull version specific information
  let versionData = details.versions[version];
  if (versionData) {
    // There is version data for this version
    // Mark information as not missing version data
    packageDetails.isVersionDataMissing = false;

    packageDetails.name = versionData.name;
    packageDetails.repositoryUrl = (() => {
      if (versionData.repository) {
        return versionData.repository.url;
      } else if (details.repository) {
        return details.repository.url;
      } else {
        return null;
      }
    })();
    packageDetails.homepage = versionData.homepage;
    packageDetails.license = versionData.license;
  } else {
    // There is no version specific data for this version
    //  Attempt to pull out some rough defaults from latest details

    // Mark information as missing version data
    packageDetails.isVersionDataMissing = true;

    packageDetails.name = details.name;
    packageDetails.repositoryUrl = (() => {
      if (details.repository) {
        return details.repository.url;
      } else {
        return null;
      }
    })();
    // @TODO is everything .homepage.url ?
    packageDetails.homepage = details.homepage.url;
    packageDetails.license = details.license;
  }

  // @TODO confirm that this cast is typesafe against interface? e.g. someshit: boolean
  return packageDetails as IPackageDetails;
}