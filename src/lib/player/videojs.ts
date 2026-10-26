// Registers the Video.js custom elements used by the audio player and the embed player.
// Import this module once (side effects only) before rendering <audio-player>.
import '@videojs/html/audio/player';
import '@videojs/html/ui/container';
import '@videojs/html/ui/play-button';
import '@videojs/html/ui/seek-button';
import '@videojs/html/ui/mute-button';
import '@videojs/html/ui/time';
import '@videojs/html/ui/time-slider';
import '@videojs/html/ui/volume-slider';
import '@videojs/html/ui/slider-track';
import '@videojs/html/ui/slider-buffer';
import '@videojs/html/ui/slider-fill';
import '@videojs/html/ui/slider-thumb';
import { registerIcons, volumeHighIcon, volumeLowIcon, volumeOffIcon } from '@videojs/html/icons';

// Only the volume icons come from Video.js, everything else uses our own <Icon />
registerIcons('default', {
	'volume-high': volumeHighIcon,
	'volume-low': volumeLowIcon,
	'volume-off': volumeOffIcon
});
