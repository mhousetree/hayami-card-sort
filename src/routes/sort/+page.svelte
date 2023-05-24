<script lang="ts">
	import { ss } from '../../data/ss';
	import Sorter from '../../modules/Sorter';
	const sort = new Sorter(ss);
	let result = sort.sort();
</script>

{#if result}
	<h1>結果発表</h1>
	<ul>
		{#each ss as item}
			<li>{item}</li>
		{/each}
	</ul>
	{sort.array}
	<a href="/">トップに戻る</a>
{:else}
	<h1>ソート</h1>
	<button
		on:click={() => {
			sort.backable = true;
			sort.prevItems = JSON.parse(JSON.stringify(sort.items));
			sort.addResult(sort.lastChallenge[0], sort.lastChallenge[1]);
			result = sort.sort();
		}}
	>
		{sort.lastChallenge[0]}
	</button>
	<button
		on:click={() => {
			sort.backable = true;
			sort.prevItems = JSON.parse(JSON.stringify(sort.items));
			sort.addResult(sort.lastChallenge[1], sort.lastChallenge[0]);
			result = sort.sort();
		}}
	>
		{sort.lastChallenge[1]}
	</button>
	<button
		on:click={() => {
			sort.backable = true;
			sort.prevItems = JSON.parse(JSON.stringify(sort.items));
			sort.addEqual(sort.lastChallenge[0], sort.lastChallenge[1]);
			result = sort.sort();
		}}
	>
		両方勝ち
	</button>
	<button
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
	</button>
	<!-- <button
		on:click={() => {
			result = true;
		}}
	>
		ソート完了
	</button> -->
{/if}
