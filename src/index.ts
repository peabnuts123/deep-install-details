import packageArg, { Result as PackageArg } from 'npm-package-arg';

import getPackagesInstalled from '@app/getPackagesInstalled';
import populatePackageDetails from '@app/populatePackageDetails';
import { Package } from '@scrutiny/core';
import { Builder } from '@scrutiny/core/util';

export default async function deepInstallDetails(...userPackageSpecifiers: string[]): Promise<Package[]> {
  // Map user-input into safe, parsed objects
  let packageSpecifiers: PackageArg[] = userPackageSpecifiers.map((s) => packageArg(s));

  // Get info about what packages will be installed
  let allPackageInfo: Builder<Package>[] = await getPackagesInstalled(packageSpecifiers);

  // Get full information for each package
  return await populatePackageDetails(allPackageInfo);
}