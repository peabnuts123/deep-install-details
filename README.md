# Scrutiny: deep-install-details
Get information about all the packages that would ACTUALLY be installed if you did `npm install $package_names`, without actually downloading / executing lifecycle scripts on any of them.

## About
This package invokes npm as a child process with the `--dry-run` flag to figure out what packages would actually be installed if you installed something into a project. It retrieves all the packages that would be installed and then queries the `npm` registry for more information about each package individually, returning the result (which can be a lot of information, depending on what you install).

## NOTE: This project is still in early development! 
It's in a state of flux right now, and is not published to `npm` yet, intentionally. Feel free to try it out directly from this repo and give me some feedback if you are at all interested in it. The plan for this package is to create a sibling package that consumes the information provided by this package and performs analysis / audits on it, for consumption by some kind of presentation layer (e.g. a CLI tool or a website). For now i'm branding this all under the name "Scrutiny". 

Note that this package is currently performing some of the responsibilities of the planned sibling package by outputting some nicely-formatted metrics and things from the data it is fetching. In a future release this will be stripped out of this package, and it will be only accessible in a programmatic way (i.e. via `require`). 

## Backlog
  _Currently empty._

## Performance
This package calls `npm install … --dry-run` under the hood (note that `--dry-run` prevents anything from being downloaded/executed), so you will need to have the ability to execute such a command in the environment you execute this from. It then makes requests directly to the npm registry for all the information it has about each package. This is currently rate-limited to 1 request every 100ms as to not abuse the npm registry, but I will need to fine-tune this number at some point in the future (hopefully lowering it). I cannot find any information about what kind of rate npm would actually like me to request, so if you know anything about this, please let me know on [Twitter](https://twitter.com/peabnuts123) or something. 

## Usage
Currently you can debug the package locally with:

```bash
  npm run debug -- (package names[@versions]…)
```


You may specify as many packages as you wish, they will be requested in batch, as if you were installing them all at once. A semantic version range may be included on any or all packages if you so wish. Naturally, if you omit the version, `latest` will be requested (mimicking how `npm install` works).


```text
$ npm run debug -- webpack webpack-stream@3.0.0

> @scrutiny/deep-install-details@0.2.0 predebug /Users/jeff/Documents/Projects/npm-dep-analyser
> npm run build


> @scrutiny/deep-install-details@0.2.0 build /Users/jeff/Documents/Projects/npm-dep-analyser
> node scripts/build.js

Running shell command 'npm run build--clean'

> @scrutiny/deep-install-details@0.2.0 build--clean /Users/jeff/Documents/Projects/npm-dep-analyser
> node scripts/build--clean.js

Running shell command 'rm -rf dist/ _build/ processing-package'


Running shell command 'tsc --project .'

Running shell command 'babel ./_build --out-dir ./dist'
🎉  Successfully compiled 16 files with Babel.

Running shell command 'rm -rf ./_build'


> @scrutiny/deep-install-details@0.2.0 debug /Users/jeff/Documents/Projects/npm-dep-analyser
> node dist/index.js -- "webpack" "webpack-stream@3.0.0"

[17:45:19] Determining installed packages for `webpack@latest, webpack-stream@3.0.0`…
[17:45:19] Node Version: v8.10.0
[17:45:19] NPM Version: 5.6.0
[17:45:19] Executing shell command: 'npm install --dry-run --json webpack@latest webpack-stream@3.0.0'
[17:47:26] Finished determining installed packages (126.51s)
[17:47:26] Fetching details for 483 packages…
[17:48:16] Finished!
[17:48:16] Total processing time: 177.99s

Summary of installing 2 packages: webpack, webpack-stream@3.0.0
   - Number of packages requested: 2

   - Number of packages installed (total): 483

   - Number of packages installed successfully: 483

   - Number of packages with version < 0.1.0: 18
         block-stream@0.0.9
         clone-stats@0.0.1
         concat-map@0.0.1
         duplexer2@0.0.2
         https-browserify@0.0.1
         indexof@0.0.1
         isarray@0.0.1
         jsonify@0.0.0
         minimist@0.0.8
         path-browserify@0.0.0
         replace-ext@0.0.1
         stringstream@0.0.5
         tty-browserify@0.0.0
         typedarray@0.0.6
         uid-number@0.0.6
         vm-browserify@0.0.4
         wordwrap@0.0.2
         wordwrap@0.0.3

   - Number of packages with version < 1.0.0: 103
         align-text@0.1.4
         ansi-gray@0.1.1
         ansi-wrap@0.1.0
         array-unique@0.2.1
         array-unique@0.3.2
         asn1@0.2.3
         assert-plus@0.2.0
         async@0.2.10
         async@0.9.2
         asynckit@0.4.0
         aws-sign2@0.6.0
         balanced-match@0.4.2
         base@0.11.2
         browserify-aes@0.4.0
         browserify-zlib@0.1.4
         browserify-zlib@0.2.0
         caseless@0.12.0
         center-align@0.1.3
         chrome-trace-event@0.1.2
         class-utils@0.3.6
         copy-descriptor@0.1.1
         cyclist@0.2.2
         date-now@0.1.4
         decode-uri-component@0.2.0
         deep-extend@0.4.2
         define-property@0.2.5
         ecc-jsbn@0.1.1
         enhanced-resolve@0.9.1
         errno@0.1.7
         expand-brackets@0.1.5
         extglob@0.3.2
         for-own@0.1.5
         forever-agent@0.6.1
         fragment-cache@0.2.1
         getpass@0.1.7
         glob-base@0.3.0
         has-gulplog@0.1.0
         has-value@0.3.1
         has-values@0.1.4
         iferr@0.1.5
         imurmurhash@0.1.4
         interpret@0.6.6
         is-accessor-descriptor@0.1.6
         is-data-descriptor@0.1.4
         is-descriptor@0.1.6
         is-equal-shallow@0.1.3
         is-extendable@0.1.1
         is-posix-bracket@0.1.1
         isstream@0.1.2
         jsbn@0.1.1
         json-schema@0.2.3
         json-schema-traverse@0.3.1
         json5@0.5.1
         loader-utils@0.2.17
         map-cache@0.2.2
         memory-fs@0.2.0
         memory-fs@0.3.0
         memory-fs@0.4.1
         mkdirp@0.5.1
         multipipe@0.1.2
         node-libs-browser@0.7.0
         node-pre-gyp@0.6.39
         oauth-sign@0.8.2
         object-copy@0.1.0
         optimist@0.6.1
         os-browserify@0.2.1
         os-browserify@0.3.0
         osenv@0.1.4
         pako@0.2.9
         pascalcase@0.1.1
         performance-now@0.2.0
         posix-character-classes@0.1.1
         preserve@0.2.0
         process@0.11.10
         querystring@0.2.0
         querystring-es3@0.2.1
         regex-cache@0.4.4
         resolve-url@0.2.1
         ret@0.1.15
         right-align@0.1.3
         ripemd160@0.2.0
         schema-utils@0.4.5
         set-value@0.4.3
         snapdragon@0.8.2
         source-list-map@0.1.8
         source-map@0.4.4
         source-map@0.5.7
         source-map@0.6.1
         source-map-resolve@0.5.1
         source-map-url@0.4.0
         static-extend@0.1.2
         string_decoder@0.10.31
         tapable@0.1.10
         to-object-path@0.3.0
         tunnel-agent@0.6.0
         tweetnacl@0.14.5
         urix@0.1.0
         url@0.11.0
         util@0.10.3
         vinyl@0.5.3
         watchpack@0.2.9
         webpack-core@0.6.9
         window-size@0.1.0

   - Number of packages that failed to install: 0

   - Number of unique publish authors: 127

   - Count of authors by number of packages published(relative to this install):
         jonschlinkert (github@sellside.com): 95
         sindresorhus (sindresorhus@gmail.com): 32
         cwmma (calvin.metcalf@gmail.com): 24
         jdalton (john.david.dalton@gmail.com): 23
         isaacs (i@izs.me): 21
         sokra (tobias.koppers@googlemail.com): 16
         iarna (me@re-becca.org): 13
         mafintosh (mathiasbuus@gmail.com): 11
         es128 (elan.shanker+npm@gmail.com): 10
         indutny (fedor@indutny.com): 9
         substack (mail@substack.net): 9
         feross (feross@feross.org): 8
         juliangruber (julian@juliangruber.com): 8
         doowb (brian.woodward@gmail.com): 7
         phated (blaine.bublitz@gmail.com): 7
         esp (e.poberezkin@me.com): 6
         arekinath (alex@cooperi.net): 5
         zkat (kat@sykosomatic.org): 5
         dcousens (email@dcousens.com): 4
         dominictarr (dominic.tarr@gmail.com): 4
         jhnns (mail@johannesewald.de): 4
         lydell (simon.lydell@gmail.com): 4
         rvagg (rod@vagg.org): 4
         substack (substack@gmail.com): 4
         alexindigo (iam@alexindigo.com): 3
         bcoe (ben@npmjs.com): 3
         dap (dap@cs.brown.edu): 3
         defunctzombie (shtylman@gmail.com): 3
         isaacs (isaacs@npmjs.com): 3
         matteo.collina (hello@matteocollina.com): 3
         mikeal (mikeal.rogers@gmail.com): 3
         pfmooney (patrick.f.mooney@gmail.com): 3
         phated (blaine@iceddev.com): 3
         qix (i.am.qix@gmail.com): 3
         raynos (raynos2@gmail.com): 3
         simov (simeonvelichkov@gmail.com): 3
         tootallnate (nathan@tootallnate.net): 3
         ahmadnassri (ahmad@ahmadnassri.com): 2
         dcousens (npm@dcousens.com): 2
         dougwilson (doug@somethingdoug.com): 2
         fanatid (fanatid@ya.ru): 2
         fractal (contact@wearefractal.com): 2
         hichaelmart (michael.hart.au@gmail.com): 2
         hueniverse (eran@hammer.io): 2
         hughsk (hughskennedy@gmail.com): 2
         jbnicolai (jappelman@xebia.com): 2
         jhiesey (john@hiesey.com): 2
         ljharb (ljharb@gmail.com): 2
         marijn (marijnh@gmail.com): 2
         mathias (mathias@qiwi.be): 2
         michael-ciniawsky (michael.ciniawsky@gmail.com): 2
         othiym23 (ogd@aoaioxxysz.net): 2
         tromey (tom@tromey.com): 2
         vitaly (vitaly@rcdesign.ru): 2
         zkat (kzm@sykosomatic.org): 2
         abetomo (abe@enzou.tokyo): 1
         aearly (alexander.early@gmail.com): 1
         alexlamsl (alexlamsl@gmail.com): 1
         andyperlitch (andyperlitch@gmail.com): 1
         anodynos (agelos.pikoulas@gmail.com): 1
         apechimp (apeherder@gmail.com): 1
         arb (arbretz@gmail.com): 1
         beaugunderson (beau@beaugunderson.com): 1
         bendrucker (bvdrucker@gmail.com): 1
         bevryme (us@bevry.me): 1
         bret (bcomnes@gmail.com): 1
         caolan (caolan.mcmahon@gmail.com): 1
         coderpuppy (coderpup@gmail.com): 1
         coolaj86 (coolaj86@gmail.com): 1
         darsain (darsain@gmail.com): 1
         dchest (dmitry@codingrobots.com): 1
         deoxxa (deoxxa@fknsrs.biz): 1
         devongovett (devongovett@gmail.com): 1
         dignifiedquire (dignifiedquire@gmail.com): 1
         domenic (d@domenic.me): 1
         drewyoung1 (coderpup@gmail.com): 1
         esailija (petka_antonov@hotmail.com): 1
         fent (roly426@gmail.com): 1
         forbeslindesay (forbes@lindeay.co.uk): 1
         fpintos (fpintos.npm@outlook.com): 1
         gozala (rfobic@gmail.com): 1
         hueniverse (eran@hueniverse.com): 1
         ivolodin (ivolodin@gmail.com): 1
         jensyt (jensyt@gmail.com): 1
         jongleberry (jonathanrichardong@gmail.com): 1
         jordanbtucker (jordanbtucker@gmail.com): 1
         jordangens (jordangens@gmail.com): 1
         jp (jprichardson@gmail.com): 1
         jprichardson (jprichardson@gmail.com): 1
         jrburke (jrburke@gmail.com): 1
         jryans (jryans@gmail.com): 1
         jstash (jstash@gmail.com): 1
         kikobeats (josefrancisco.verdu@gmail.com): 1
         kkoopa (bbyholm@abo.fi): 1
         kriszyp (kriszyp@gmail.com): 1
         leo (leo@zeit.co): 1
         lovell (npm@lovell.info): 1
         meryn (merynstol@gmail.com): 1
         michaelficarra (npm@michael.ficarra.me): 1
         mikemcl (M8ch88l@gmail.com): 1
         nadav (npm@shesek.info): 1
         nami-doc (karp@hotmail.fr): 1
         nexdrew (andrewbgoode@gmail.com): 1
         nickfitzgerald (fitzgen@gmail.com): 1
         nlf (quitlahok@gmail.com): 1
         nzakas (nicholas@nczconsulting.com): 1
         okuryu (okuryu@okuryu.com): 1
         paulmillr (paul@paulmillr.com): 1
         pvorb (paul@vorba.ch): 1
         quartzjer (jeremie@jabber.org): 1
         ralphtheninja (ralphtheninja@riseup.net): 1
         rvagg (r@va.gg): 1
         rvanvelzen1 (rvanvelzen1@gmail.com): 1
         samccone (sam@samx.it): 1
         samverschueren (sam.verschueren@gmail.com): 1
         shama (kyle@dontkry.com): 1
         shinnn (snnskwtnb@gmail.com): 1
         shtylman (shtylman@gmail.com): 1
         spaintrain (mc.s.pain.how.er+npm@gmail.com): 1
         springmeyer (dane@mapbox.com): 1
         stevemao (steve.mao@healthinteract.com.au): 1
         suguru03 (suguru.motegi@gmail.com): 1
         thlorenz (thlorenz@gmx.de): 1
         tjholowaychuk (tj@vision-media.ca): 1
         tkellen (tyler@sleekcode.net): 1
         trentm (trentm@gmail.com): 1
         unclechu (lotsmanov89@gmail.com): 1

Successfully finished processing.
``` 