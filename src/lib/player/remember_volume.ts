import { selectVolume } from '@videojs/html';
import type { AudioPlayerElement } from '@videojs/html/audio';

const STORAGE_KEY = 'syntax-player-volume';
// media-chrome saved volume here, read it so listeners keep their setting after the migration
const LEGACY_STORAGE_KEY = 'media-chrome-pref-volume';

function read_saved_volume(): number | null {
	try {
		const value = parseFloat(
			localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY) ?? ''
		);
		return Number.isFinite(value) ? value : null;
	} catch {
		return null;
	}
}

function save_volume(volume: number) {
	try {
		localStorage.setItem(STORAGE_KEY, volume.toString());
	} catch {
		// Storage unavailable, skip persistence
	}
}

// Restores the saved volume once media is attached, then saves changes.
// Video.js doesn't persist volume itself: https://videojs.org/docs/framework/html/guides/user-preferences
export function remember_volume(player: AudioPlayerElement) {
	const store = player.store;
	let restored = false;
	let last_volume = read_saved_volume();

	const sync = () => {
		// Actions throw before the store attaches to the media
		if (!store.target) return;
		const volume = selectVolume(store.state);
		if (!volume) return;

		if (!restored) {
			restored = true;
			if (last_volume !== null) volume.setVolume(last_volume);
			return;
		}

		if (volume.volume !== last_volume) {
			last_volume = volume.volume;
			save_volume(volume.volume);
		}
	};

	sync();
	return store.subscribe(sync);
}
