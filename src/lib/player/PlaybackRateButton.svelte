<script lang="ts">
	import type { AudioPlayerElement } from '@videojs/html/audio';
	import { onMount } from 'svelte';

	// Video.js' <media-playback-rate-button> has a fixed rate list that starts at 0.2x,
	// so we cycle through podcast-friendly speeds using the player store instead.
	const RATES = [1, 1.2, 1.5, 1.7, 2];

	let button: HTMLButtonElement;
	let player: AudioPlayerElement | null = null;
	let rate = $state(1);

	onMount(() => {
		player = button.closest('audio-player');
		if (!player) return;
		const store = player.store;
		const sync = () => (rate = store.playbackRate);
		sync();
		return store.subscribe(sync);
	});

	function cycle_rate() {
		// Store actions throw until the media is attached
		if (!player?.store.target) return;
		const index = RATES.indexOf(rate);
		const next =
			index === -1 ? (RATES.find((r) => r > rate) ?? RATES[0]) : RATES[(index + 1) % RATES.length];
		player.store.setPlaybackRate(next);
	}
</script>

<button
	bind:this={button}
	class="media-playback-rate-button"
	type="button"
	onclick={cycle_rate}
	aria-label={`Playback rate ${rate}`}
	title="Playback rate">{rate}x</button
>

<style>
	.media-playback-rate-button {
		--button-bg: transparent;
		--button-fg: var(--fg);
		padding: 0;
		min-width: 4ch;
		font-size: var(--font-size-sm);
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		box-shadow: none;
	}
</style>
