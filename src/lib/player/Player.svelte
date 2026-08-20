<script lang="ts">
	import { player } from '$state/player';
	import { player_window_status } from '$state/player_window_status';
	import AlbumArt from './AlbumArt.svelte';
	import get_show_path from '$utilities/slug';
	import Icon from '../Icon.svelte';
	import ShareButton from '../share/HairButton.svelte';
	import { onMount } from 'svelte';
	import type { Show } from '@prisma/client';

	interface Props {
		initial_show: Show;
	}

	let { initial_show }: Props = $props();

	onMount(() => {
		// Video.js v10 custom elements can only be registered in the browser
		import('./videojs_elements');
		// Load latest show by default
		player.initialize(initial_show);
	});

	let mix_max_verb = $derived($player_window_status === 'MINI' ? 'Maximize' : 'Minimize');
</script>

<section class="player {$player_window_status} {$player.status}">
	<div class="window-controls">
		{#if $player.current_show}<ShareButton show={$player.current_show} />{/if}
		<button
			class="minimize"
			onclick={player.toggle_minimize}
			aria-label={`${mix_max_verb} Player`}
			title={`${mix_max_verb} Player`}><Icon name="minimize" /></button
		>
		<button class="close" onclick={player.close} aria-label="Close Player" title="Close Player"
			>×</button
		>
	</div>

	<div class="player-container">
		{#if $player_window_status === 'ACTIVE'}
			<AlbumArt />
		{/if}

		<div style="flex-grow: 1;">
			{#if $player.current_show}
				<p>
					<a id="player_show_title" href={get_show_path($player.current_show)}
						>Show #{$player.current_show?.number} - {$player.current_show?.title}</a
					>
				</p>
			{/if}
			<audio-player bind:this={$player.media_controller}>
				<media-container>
					<audio
						ontimeupdate={player.ontimeupdate}
						onplay={player.onplay}
						onended={player.onended}
						onpause={player.onpause}
						bind:this={$player.audio}
						preload="metadata"
						crossorigin="anonymous"
					></audio>
					{#if $player_window_status === 'ACTIVE'}
						<div class="media-bar">
							<div class="media-controls">
								<media-seek-button seconds="-30">
									<Icon name="back-30" />
								</media-seek-button>
								<media-play-button>
									<span class="play-icon" style="--icon_size: 26px;">
										<Icon name="play" />
									</span>
									<span class="pause-icon" style="--icon_size: 26px;">
										<Icon name="pause" />
									</span>
								</media-play-button>
								<media-seek-button seconds="30">
									<Icon name="forward-30" />
								</media-seek-button>
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
								<media-mute-button>
									<!-- Icons from @videojs/icons (Apache-2.0) -->
									<span class="icon-unmuted" aria-hidden="true"
										><svg
											xmlns="http://www.w3.org/2000/svg"
											width="18"
											height="18"
											fill="currentColor"
											viewBox="0 0 18 18"
											><path
												d="M15.6 3.3c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4C15.4 5.9 16 7.4 16 9s-.6 3.1-1.8 4.3c-.4.4-.4 1 0 1.4.2.2.5.3.7.3.3 0 .5-.1.7-.3C17.1 13.2 18 11.2 18 9s-.9-4.2-2.4-5.7"
											/><path
												d="M.714 6.008h3.072l4.071-3.857c.5-.376 1.143 0 1.143.601V15.28c0 .602-.643.903-1.143.602l-4.071-3.858H.714c-.428 0-.714-.3-.714-.752V6.76c0-.451.286-.752.714-.752m10.568.59a.91.91 0 0 1 0-1.316.91.91 0 0 1 1.316 0c1.203 1.203 1.47 2.216 1.522 3.208q.012.255.011.51c0 1.16-.358 2.733-1.533 3.803a.7.7 0 0 1-.298.156c-.382.106-.873-.011-1.018-.156a.91.91 0 0 1 0-1.316c.57-.57.995-1.551.995-2.487 0-.944-.26-1.667-.995-2.402"
											/></svg
										></span
									>
									<span class="icon-muted" aria-hidden="true"
										><svg
											xmlns="http://www.w3.org/2000/svg"
											width="18"
											height="18"
											fill="currentColor"
											viewBox="0 0 18 18"
											><path
												d="M.714 6.008h3.072l4.071-3.857c.5-.376 1.143 0 1.143.601V15.28c0 .602-.643.903-1.143.602l-4.071-3.858H.714c-.428 0-.714-.3-.714-.752V6.76c0-.451.286-.752.714-.752M14.5 7.586l-1.768-1.768a1 1 0 1 0-1.414 1.414L13.085 9l-1.767 1.768a1 1 0 0 0 1.414 1.414l1.768-1.768 1.768 1.768a1 1 0 0 0 1.414-1.414L15.914 9l1.768-1.768a1 1 0 0 0-1.414-1.414z"
											/></svg
										></span
									>
								</media-mute-button>
								<media-volume-slider>
									<media-slider-track>
										<media-slider-fill></media-slider-fill>
									</media-slider-track>
									<media-slider-thumb></media-slider-thumb>
								</media-volume-slider>
							</div>
						</div>
					{/if}
				</media-container>
			</audio-player>
		</div>
	</div>
</section>

<style lang="postcss">
	.media-bar {
		display: grid;
		grid-template-rows: [start top] auto [top bottom] auto [bottom end];
		grid-template-columns: [start controls] auto [controls range] auto [range end];
		height: 100%;
		align-items: center;
		gap: 20px;
		font-family: var(--body-font-family);
		@container (min-width: 650px) {
			grid-template-columns: [start controls] auto [controls range] 1fr [range sound] auto [sound end];
			grid-template-rows: 1fr;
			grid-column: range / range;
		}
	}

	media-container {
		display: block;
		width: 100%;
		flex-grow: 1;
	}

	.media-range {
		grid-row: top / top;
		grid-column: start / end;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 10px;
		@container (min-width: 650px) {
			grid-column: range / range;
			grid-row: 1;
		}
	}

	.media-controls {
		grid-column: controls / controls;
		grid-row: bottom / bottom;
		display: flex;
		gap: 16px;
		align-items: baseline;
		@container (min-width: 650px) {
			grid-column: controls / controls;
			grid-row: 1;
		}
	}

	.media-sound {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.window-controls {
		position: absolute;
		top: 0;
		right: 0;
		display: flex;
		padding: 5px 10px;
		background-color: var(--player-bg, var(--black));
	}

	/* Video.js v10 buttons are the host element itself (role="button"),
	   with no default icons — content and cursor are ours to provide. */
	media-play-button,
	media-seek-button,
	media-mute-button,
	media-playback-rate-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
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

	media-mute-button .icon-muted {
		display: none;
	}
	/* State attributes like data-muted are set at runtime, so Svelte would
	   prune these scoped selectors as "unused" — hence :global() */
	.player :global(media-mute-button[data-muted] .icon-muted) {
		display: inline-flex;
	}
	.player :global(media-mute-button[data-muted] .icon-unmuted) {
		display: none;
	}

	media-playback-rate-button {
		font-size: var(--font-size-sm);
	}
	.player :global(media-playback-rate-button[data-rate]::after) {
		content: attr(data-rate) 'x';
	}

	/* Sliders are compound and headless: track, fill, and thumb are ours to style */
	media-time-slider,
	media-volume-slider {
		position: relative;
		display: flex;
		align-items: center;
		height: 15px;
		cursor: pointer;
		touch-action: none;
	}

	media-time-slider {
		width: 100%;
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

	media-volume-slider {
		width: 70px;

		media-slider-fill {
			background: var(--primary);
		}

		media-slider-thumb {
			background: var(--white);
		}
	}

	p {
		margin-top: 0;
		font-size: var(--font-size-sm);
	}

	a {
		text-decoration: none;
	}

	.minimize :global(svg) {
		transition: 0.3s ease rotate;
	}

	.playback-buttons {
		display: flex;
		align-items: center;
		gap: 5px;
	}

	.player {
		--player-bg: var(--bg-root);
		container: player / inline-size;
		position: fixed;
		bottom: 0;
		width: 100%;
		color: var(--fg);
		background-color: var(--player-bg, var(--black));
		background-image: var(--bg-grit-dark);
		background-size: 400px;
		box-shadow: 0 -5px 10px 0 oklch(var(--blacklch) / 0.4);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		translate: 0 100% 0;
		transition: 0.2s ease translate;
		z-index: 10;

		&.ACTIVE {
			translate: 0 0 0;
		}
		&.MINI {
			translate: 0 0 0;

			media-container {
				overflow: hidden;
				height: 0;
				position: absolute;
			}

			.minimize {
				:global(svg) {
					rotate: 180deg;
				}
			}

			p {
				margin: 0;
			}

			.media-range {
				width: 100%;
			}

			.media-bar,
			.player-container {
				height: max-content;
				padding: 10px;
			}
		}
	}

	.player-container {
		padding: 10px 20px;
		width: 100%;
		display: flex;
		gap: 25px;
	}

	.media-range-bookmarks {
		position: relative;
		width: 100%;
	}

	media-time {
		padding: 0;
		font-size: var(--font-size-xs);
	}

	button {
		--button-bg: transparent;
		--button-fg: var(--fg);
	}
</style>
