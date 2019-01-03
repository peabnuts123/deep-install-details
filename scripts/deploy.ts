import { deploy } from '@scrutiny/core/scripts';
import { getBaseBuildConstants } from '@scrutiny/core/scripts/util';

(async () => {
  let buildConstants = getBaseBuildConstants();

  await deploy(buildConstants);
})();