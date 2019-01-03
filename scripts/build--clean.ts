import { cleanBuild } from "@scrutiny/core/scripts";
import { getBaseBuildConstants } from "@scrutiny/core/scripts/util";

const buildConstants = getBaseBuildConstants();

const foldersToClean: string[] = [
  buildConstants.publishDirectory,
  buildConstants.tsBuildFolder,
  'processing-package',
];

(async () => {
  await cleanBuild(foldersToClean);
})();