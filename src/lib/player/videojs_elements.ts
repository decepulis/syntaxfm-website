// Registers the Video.js v10 custom elements used by the site's audio players.
// Client-only: @videojs/html references HTMLElement at module scope, so this
// must be loaded via a dynamic import() in the browser and never during SSR.
import '@videojs/html/audio/player';
import '@videojs/html/ui/play-button';
import '@videojs/html/ui/seek-button';
import '@videojs/html/ui/time';
import '@videojs/html/ui/time-slider';
import '@videojs/html/ui/mute-button';
import '@videojs/html/ui/volume-slider';
import '@videojs/html/ui/playback-rate-button';
