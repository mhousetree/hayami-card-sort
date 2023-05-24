<script lang="ts">
	import { ssCards } from '../../data/ss';
	import Sorter from '../../modules/Sorter';
	const sort = new Sorter(Object.keys(ssCards));
	let result = sort.sort();
</script>

{#if result}
	<section id="result">
		<h1>結果発表</h1>
		<ol>
			{#each sort.array as item}
				<li>{ssCards[item]}</li>
			{/each}
		</ol>
		<a href="/">トップに戻る</a>
	</section>
{:else}
	<section id="sort">
		<h1>ソート</h1>
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
				両方勝ち
			</button>
			<!-- <button
			on:click={() => {
				if (sort.backable) {
					sort.back();
					result = sort.sort();
				} else {
					alert('これ以上戻れません！');
				}
			}}
		>
			ひとつ戻る
		</button> -->
		</section>
	</section>
{/if}

<style lang="scss">
	#sort {
		text-align: center;
		margin-top: 4rem;
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
			font-size: 1.2rem;
			transition: .2s;

			&:hover {
				translate: 0 -2px;
				box-shadow: 0 4px 15px #6661;
			}

			h2 {
				font-size: 1em;
				margin: 0;
				margin-top: .8rem;
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
</style>
