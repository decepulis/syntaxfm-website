<script lang="ts">
	import '$/routes/(site)/style.css';
	import { format } from 'date-fns';
	import Icon from '$/lib/Icon.svelte';
	import ListenLinks from '$/lib/ListenLinks.svelte';
	import AlbumArt from '$/lib/player/AlbumArt.svelte';
	import ShareButton from '$/lib/share/HairButton.svelte';
	import { Toaster } from 'svelte-french-toast';
	import ShareActions from '$/lib/share/ShareActions.svelte';
	import { fade } from 'svelte/transition';
	import { episode_share_status } from '$/state/player.js';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	onMount(() => {
		// Video.js v10 custom elements can only be registered in the browser
		import('$/lib/player/videojs_elements');
	});

	let { data } = $props();
	let { show } = $derived(data);

	function toggle_share() {
		$episode_share_status = !$episode_share_status;
	}
</script>

<div class={'theme-system theme-wrapper zone'}>
	<figure class="zone" style:--bg="var(--black)" style:--fg="var(--white)">
		<span style:--transition-name="show-date-{show.number}" class="show-number fst-900 grit"
			>{show.number}</span
		>

		<p class="show-page-date" style:--transition-name="show-date-{show.number}">
			{format(new Date(show.date), 'MMMM do, yyyy')}
		</p>
		<h1>
			<span class="spa-ran-wrap">{show.title} </span>
		</h1>

		<div class="player-container">
			<AlbumArt is_link={true} {show} />

			{#if browser}
				<audio-player>
					<media-container>
						<audio preload="metadata" crossorigin="anonymous" src={show.url}></audio>
						<div class="media-bar">
							<div class="media-controls">
								<media-play-button>
									<span class="play-icon" style="--icon_size: 32px;">
										<Icon name="play" />
									</span>
									<span class="pause-icon" style="--icon_size: 32px;">
										<Icon name="pause" />
									</span>
								</media-play-button>
							</div>
							<div class="media-range">
								<media-time type="current"></media-time>
								<div class="media-range-bookmarks">
									<media-time-slider>
										<media-slider-track>
											<media-slider-fill></media-slider-fill>
										</media-slider-track>
										<media-slider-thumb></media-slider-thumb>
									</media-time-slider>
								</div>
								<media-time type="duration"></media-time>
							</div>
							<div class="media-sound">
								<media-playback-rate-button></media-playback-rate-button>
							</div>
						</div>
					</media-container>
				</audio-player>
			{/if}
		</div>

		<div class="embed-actions">
			<ShareButton {show} />
			<ListenLinks {show} />
			<a
				target="_blank"
				class="icon"
				title="Download Episode"
				aria-label="Download"
				download
				href={show.url}
			>
				<Icon name="download" />
			</a>
		</div>
		{#if $episode_share_status}
			<div class="overtake" transition:fade={{ duration: 200 }}>
				<button onclick={toggle_share} class="close">×</button>
				<ShareActions {show} timestamp={false} />
			</div>
		{/if}
	</figure>
</div>

<Toaster />

<style lang="postcss">
	figure {
		--spa-ran-wrap-bg: var(--black);
		border-bottom: solid var(--fg) 1px;
		position: relative;
		z-index: 1;
		margin: 0;
		height: 230px;
		overflow: hidden;
		padding: 20px;
		background-size: contain;
		background-image:
			var(--bg-grit-dark),
			radial-gradient(farthest-side circle at 50% 0%, #3a006b66 4% 4%, #000 100%);
	}
	p {
		margin-top: 0;
	}

	.overtake {
		position: absolute;
		background: var(--bg);
		inset: 0;
		z-index: 1;
		padding: 20px;
		display: flex;
		height: 100%;
		align-content: center;
		justify-content: center;
		align-items: center;
		gap: 10px;
	}

	.close {
		top: 10px;
		right: 10px;
		position: absolute;
	}

	h1 {
		font-size: var(--font-size-md);
		height: 64px;
	}

	media-time-slider {
		width: 100%;
	}
	.player-container {
		width: 100%;
		display: flex;
		gap: 20px;
	}

	.media-range-bookmarks {
		position: relative;
		width: 100%;
	}

	.show-page-date {
		font-size: var(--font-size-sm);
	}

	.show-number {
		position: absolute;
		right: 0;
		top: 0;
		transform: translate(6.9%, -22%);
		--max-font-size: 15rem;
		--ideal-font-size: 45cqw;
		font-size: clamp(1.5rem, var(--ideal-font-size), var(--max-font-size));
		@media (prefers-color-scheme: dark) {
			--ideal-font-size: 22cqw;
		}
		color: var(--primary);
		line-height: 1;
		z-index: -1;
	}

	.media-range {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 10px;
		grid-column: range / range;
		grid-row: 1;
	}

	.media-bar {
		display: grid;
		height: 100%;
		align-items: center;
		gap: 10px;
		grid-template-columns: [start controls] auto [controls range] 1fr [range sound] auto [sound end];
		grid-template-rows: 1fr;
		grid-column: range / range;
		font-family: var(--body-font-family);
	}

	media-container {
		display: block;
		width: 100%;
		flex-grow: 1;
	}

	.media-controls {
		display: flex;
		gap: 16px;
		align-items: baseline;
		grid-column: controls / controls;
		grid-row: 1;
	}

	/* Video.js v10 buttons are the host element itself (role="button"),
	   with no default icons — content and cursor are ours to provide. */
	media-play-button,
	media-playback-rate-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		cursor: pointer;
		color: var(--fg);
	}

	/* Show the play icon until the element upgrades and reports state */
	media-play-button .pause-icon {
		display: none;
	}
	media-play-button:defined:not([data-paused]) .play-icon {
		display: none;
	}
	media-play-button:defined:not([data-paused]) .pause-icon {
		display: inline-flex;
	}

	media-playback-rate-button {
		font-size: var(--font-size-sm);
	}
	/* data-rate is set at runtime, so Svelte would prune this scoped
	   selector as "unused" — hence :global() */
	.player-container :global(media-playback-rate-button[data-rate]::after) {
		content: attr(data-rate) 'x';
	}

	/* Sliders are compound and headless: track, fill, and thumb are ours to style */
	media-time-slider {
		position: relative;
		display: flex;
		align-items: center;
		height: 15px;
		cursor: pointer;
		touch-action: none;
	}

	media-slider-track {
		position: absolute;
		right: 0;
		left: 0;
		height: 5px;
		overflow: hidden;
		background: oklch(var(--whitelch) / 0.2);
		border-radius: 5px;
	}

	media-slider-fill {
		position: absolute;
		top: 0;
		left: 0;
		width: var(--media-slider-fill);
		height: 100%;
		background: var(--white);
	}

	media-slider-thumb {
		position: absolute;
		left: var(--media-slider-fill);
		width: 15px;
		height: 15px;
		background: var(--primary);
		transform: translateX(-50%);
	}

	media-time {
		padding: 0;
		font-size: var(--font-size-xs);
	}

	.embed-actions {
		display: flex;
		gap: 10px;
		justify-content: flex-end;
		position: absolute;
		right: 10px;
		bottom: 12px;

		:global(button) {
			padding: 0;
		}
	}

	:global(a[href^='http']:not(.social-icon, .button, .icon, .naked)::after) {
		content: '';
	}
</style>
