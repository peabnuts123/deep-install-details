import _ from 'lodash';

import { Package } from '@scrutiny/core';
import { Builder, ObjectBuilder } from '@scrutiny/core/util';

export default function processInstallInformation(installInformation: NpmInstallOutput): Builder<Package>[] {
  return _.chain(installInformation.added)
    .map((addedPackage: NpmInstallPackage) => {
      return ObjectBuilder.create(Package.Assemble, {
        name: addedPackage.name,
        version: addedPackage.version,
      });
    })
    .orderBy(['name', 'version'])
    .sortedUniqBy((pkg: Builder<Package>) => `${pkg.name}@${pkg.version}`)
    .value();
}