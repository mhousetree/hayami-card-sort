<script lang="ts">
	import { onMount } from 'svelte';
	import { ssCards } from '../../data/ss';
	import Sorter from '../../modules/Sorter';
	const sort = new Sorter(Object.keys(ssCards));
	let result = sort.sort();

	onMount(() => {
		// overflow: hidden
		// @ts-ignore
		document.querySelector('html').style.overflow = 'scroll';
	});

	const getTweetLink = (one: string, two: string, three: string) => {
		// https://tools.ikunaga.net/tweet-link/
		return `https://twitter.com/intent/tweet?text=%E7%A7%81%E3%81%AE%E9%80%9F%E6%B0%B4%E5%A5%8F%E3%81%95%E3%82%93%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%83%A9%E3%83%B3%E3%82%AD%E3%83%B3%E3%82%B0TOP3%E3%81%AF%E3%80%81%0A1.%20${one}%0A2.%20${two}%0A3.%20${three}%0A%E3%81%A7%E3%81%97%E3%81%9F%EF%BC%81%0A%0A%E9%80%9F%E6%B0%B4%E5%A5%8F%E3%81%95%E3%82%93%E3%82%AB%E3%83%BC%E3%83%89%E3%82%A4%E3%83%A9%E3%82%B9%E3%83%88%E3%82%BD%E3%83%BC%E3%83%88%E3%81%A7%E9%81%8A%E3%82%93%E3%81%A7%E3%81%BF%E3%82%88%E3%81%86%EF%BC%81%0Ahttps%3A%2F%2Fhayami-card-sort.vercel.app%2F`;
	};
</script>

{#if result}
	<section id="result">
		<h1>結果発表</h1>
		<ol id="top3">
			{#each sort.array as item, i}
				{#if i < 3}
					<li>
						<img src={`./assets/ss/${item}.jpeg`} alt={ssCards[item]} />
						<p>
							{ssCards[item]}
						</p>
					</li>
				{/if}
			{/each}
		</ol>
		<div id="over4">
			<ol id="over4-first">
				{#each sort.array as item, i}
					{#if i > 2 && i < (sort.array.length - 3) / 2 + 3}
						<li>{ssCards[item]}</li>
					{/if}
				{/each}
			</ol>
			<ol id="over4-second">
				{#each sort.array as item, i}
					{#if i > (sort.array.length - 3) / 2 + 3}
						<li>{ssCards[item]}</li>
					{/if}
				{/each}
			</ol>
		</div>
		<a
			id="tweetbutton"
			href={getTweetLink(ssCards[sort.array[0]], ssCards[sort.array[1]], ssCards[sort.array[2]])}
			target="_blank"><img src="./twitter.png" alt="tweetbutton" />ツイートする</a
		>
		<a id="to_top" href="/">トップに戻る</a>
	</section>
{:else}
	<section id="sort">
		<p>ラウンド{sort.currentRound} - {sort.progress}%</p>
		<section id="choices">
			<button
				id="left-choice"
				on:click={() => {
					sort.backable = true;
					sort.prevItems = JSON.parse(JSON.stringify(sort.items));
					sort.addResult(sort.lastChallenge[0], sort.lastChallenge[1]);
					result = sort.sort();
				}}
			>
				<img src={`./assets/ss/${sort.lastChallenge[0]}.jpeg`} alt="" />
				<h2>
					{ssCards[sort.lastChallenge[0]]}
				</h2>
			</button>
			<button
				id="right-choice"
				on:click={() => {
					sort.backable = true;
					sort.prevItems = JSON.parse(JSON.stringify(sort.items));
					sort.addResult(sort.lastChallenge[1], sort.lastChallenge[0]);
					result = sort.sort();
				}}
			>
				<img src={`./assets/ss/${sort.lastChallenge[1]}.jpeg`} alt="" />
				<h2>
					{ssCards[sort.lastChallenge[1]]}
				</h2>
			</button>
			<button
				id="both-win"
				on:click={() => {
					sort.backable = true;
					sort.prevItems = JSON.parse(JSON.stringify(sort.items));
					sort.addEqual(sort.lastChallenge[0], sort.lastChallenge[1]);
					result = sort.sort();
				}}
			>
				同じぐらい好き
			</button>
		</section>
	</section>
{/if}

<style lang="scss">
	#sort {
		box-sizing: border-box;
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		text-align: center;
		margin: 0 auto;
		padding-bottom: 2rem;
		width: min(90%, 960px);
	}
	#choices {
		display: grid;
		width: 100%;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.5rem;

		button {
			border: 1px solid #0001;
			background-color: #fff;
			box-shadow: 0 2px 10px #0001;
			border-radius: 4px;
			padding: 1rem;
			font-size: min(2vw, 1.2rem);
			transition: 0.2s;

			&:hover {
				translate: 0 -2px;
				box-shadow: 0 4px 15px #6661;
			}

			h2 {
				font-size: 1em;
				margin: 0;
				margin-top: 0.8rem;
			}

			img {
				width: 100%;
				display: block;
				aspect-ratio: 45/29;
				object-fit: contain;
			}
		}

		#both-win {
			grid-column: 1 / -1;
		}
	}

	#result {
		width: min(80%, 800px);
		margin: 0 auto;
		font-size: min(1rem, 1.9vw);

		h1 {
			text-align: center;
			margin-top: 4rem;
		}

		#top3 {
			width: 100%;
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			column-gap: 2rem;
			counter-reset: item;
			margin: 0;

			li:first-of-type {
				grid-column: 1 / -1;
				width: 80%;
				justify-self: center;

				p::before {
					background-color: #cc9f52;
				}
			}

			li:nth-of-type(2) p::before {
				background-color: #7d908b;
			}

			li:nth-of-type(3) p::before {
				background-color: #a86539;
			}

			li {
				display: flex;
				flex-direction: column;
				align-items: center;
				padding-left: 0;

				&::before {
					content: none;
				}
				p {
					width: fit-content;
					position: relative;
					padding-left: 2.5em;
				}
				p::before {
					position: absolute;
					left: 0;
					display: block;
					counter-increment: item;
					content: counter(item);
					width: 2em;
					height: 2em;
					text-align: center;
					line-height: 2em;
					border-radius: 50%;
					color: #fff;
				}
			}
		}

		#over4 {
			display: flex;
			justify-content: space-between;
		}

		ol {
			list-style-type: none;
			padding: 0;

			li {
				position: relative;
				padding-left: 2.5em;
				line-height: 2em;
				margin-bottom: 1em;
			}

			li::before {
				position: absolute;
				left: 0;
				display: block;
				counter-increment: item;
				content: counter(item);
				background-color: #ddd;
				width: 2em;
				height: 2em;
				text-align: center;
				line-height: 2em;
				border-radius: 50%;
			}

			li:nth-of-type(n + 4) {
				grid-column: 1 / -1;
			}

			img {
				width: 100%;
			}
		}
	}

	#tweetbutton {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-decoration: none;

		img {
			width: 64px;
			margin-bottom: 0.5rem;
		}
	}

	#to_top {
		position: relative;
		display: block;
		width: fit-content;
		margin: 2rem auto 2rem;
		padding: 0.5rem 0.7rem 0.5rem 1rem;
		border-radius: 4px;
		letter-spacing: 0.1rem;
		text-decoration: none;
		background-color: #333772;
		color: #fbffcf;
		overflow: hidden;

		&::after {
			content: '';
			position: absolute;
			display: block;
			width: 3rem;
			height: 3rem;
			top: -0.3rem;
			right: -4.5rem;
			transform: skew(-45deg);
			background-color: #666;
			mix-blend-mode: overlay;
		}

		&:hover {
			animation: blink 0.8s ease-in-out 0s infinite alternate both;
			@keyframes blink {
				from {
					background-color: #333772;
				}
				to {
					background-color: #494d90;
				}
			}

			&:after {
				animation: shine 0.8s ease-in-out 0s infinite normal both;
				@keyframes shine {
					from {
						right: -4.5rem;
					}
					to {
						right: 9rem;
					}
				}
			}
		}
	}

	@media screen and (max-width: 700px) {
		#sort {
			height: max-content;
			p {
				margin-top: 3rem;
			}
		}

		#choices {
			grid-template-columns: 1fr;
			width: 80%;
			margin: 0 auto;
			button {
				font-size: 14px;
			}
		}

		#result {
			font-size: 14px;

			h1 {
				margin-top: 3rem;
			}

			#top3 {
				grid-template-columns: 1fr;

				li:first-of-type {
					width: 100%;
				}
			}
		}

		#over4 {
			flex-direction: column;
			align-items: center;

			ol {
				margin: 0;
			}
		}

		#tweetbutton {
			margin-top: 1rem;
		}
	}
</style>
