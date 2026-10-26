<script lang="ts">
	import { player } from '$state/player';
	import { player_window_status } from '$state/player_window_status';
	import AlbumArt from './AlbumArt.svelte';
	import get_show_path from '$utilities/slug';
	import Icon from '../Icon.svelte';
	import ShareButton from '../share/HairButton.svelte';
	import PlaybackRateButton from './PlaybackRateButton.svelte';
	import { remember_volume } from './remember_volume';
	import './videojs';
	import './player-controls.css';
	import { onMount } from 'svelte';
	import type { Show } from '@prisma/client';

	interface Props {
		initial_show: Show;
	}

	let { initial_show }: Props = $props();

	onMount(() => {
		// Load latest show by default
		player.initialize(initial_show);
		if ($player.player_element) return remember_volume($player.player_element);
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
			<audio-player bind:this={$player.player_element}>
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
								<media-seek-button seconds={-30}>
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
								<media-seek-button seconds={30}>
									<Icon name="forward-30" />
								</media-seek-button>
							</div>
							<div class="media-range">
								<media-time type="current"></media-time>
								<div class="media-range-bookmarks">
									<media-time-slider>
										<media-slider-track>
											<media-slider-buffer></media-slider-buffer>
											<media-slider-fill></media-slider-fill>
										</media-slider-track>
										<media-slider-thumb></media-slider-thumb>
									</media-time-slider>
								</div>
								<media-time type="duration"></media-time>
							</div>
							<div class="media-sound">
								<PlaybackRateButton />
								<media-mute-button>
									<media-icon class="volume-high-icon" name="volume-high" aria-hidden="true"
									></media-icon>
									<media-icon class="volume-low-icon" name="volume-low" aria-hidden="true"
									></media-icon>
									<media-icon class="volume-off-icon" name="volume-off" aria-hidden="true"
									></media-icon>
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
		@container (min-width: 650px) {
			grid-template-columns: [start controls] auto [controls range] 1fr [range sound] auto [sound end];
			grid-template-rows: 1fr;
			grid-column: range / range;
		}
	}
	audio-player {
		width: 100%;
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

	.media-control-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 10px;
		width: 100;
	}

	.window-controls {
		position: absolute;
		top: 0;
		right: 0;
		display: flex;
		padding: 5px 10px;
		background-color: var(--player-bg, var(--black));
	}

	.media-sound {
		display: flex;
		align-items: center;
		gap: 20px;
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

			audio-player {
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

	button {
		--button-bg: transparent;
		--button-fg: var(--fg);
	}
</style>
