import { build } from '@scrutiny/core/scripts';
import { getBaseBuildConstants } from '@scrutiny/core/scripts/util';

(async () => {
  const buildConstants = getBaseBuildConstants();
  await build(buildConstants);
})();