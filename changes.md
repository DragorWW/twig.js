## Move 
- `Twig.indexOf` -> `require('./helper/indexOf')`
- `Twig.forEach` -> `require('./helper/forEach')`
- `Twig.merge` -> `require('./helper/merge')`
- `Twig.lib.is` -> `require('./helper/is')`
- `Twig.lib.copy` -> `require('./helper/copy')`
- `Twig.lib.extend` -> `require('./helper/extend')`
- `Twig.lib.replaceAll` -> `require('./helper/replaceAll')`
- `Twig.lib.sprintf` -> `require('locutus/php/strings/sprintf')`
- `Twig.lib.vsprintf` -> `require('locutus/php/strings/vsprintf')`
- `Twig.lib.round` -> `require('locutus/php/math/round')`
- `Twig.lib.max` -> `require('locutus/php/math/max')`
- `Twig.lib.min` -> `require('locutus/php/math/min')`
- `Twig.lib.strip_tags` -> `require('locutus/php/strings/strip_tags')`
- `Twig.lib.strtotime` -> `require('locutus/php/datetime/strtotime')`
- `Twig.lib.date` -> `require('locutus/php/datetime/date')`
- `Twig.lib.boolval` -> `require('locutus/php/var/boolval')`

# Remove
- `Twig.lib`

## Object.assign
add check `Object.assign` for:
- `helper/megre`
- `helper/extend`