import { Terminal } from 'xterm'
import * as fit from 'xterm/lib/addons/fit/fit'
import * as attach from 'xterm/lib/addons/attach/attach'
Terminal.applyAddon(fit)
Terminal.apply(fit)
Terminal.applyAddon(attach)
Terminal.apply(attach)

export default Terminal
