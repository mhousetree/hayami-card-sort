<script>
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	import { ssCards } from '../data/ss';

	onMount(() => {
		// リサイズに対応
		const onResize = () => {
			const width = window.innerWidth;
			const height = window.innerHeight;

			renderer.setPixelRatio(width / height);
			renderer.setSize(width, height);

			camera.aspect = width / height;
			camera.updateProjectionMatrix();
		};

		window.addEventListener('resize', onResize);

		// レンダラーを作成
		const target = document.querySelector('#myCanvas');
		if (!target) {
			return;
		}
		const renderer = new THREE.WebGLRenderer({
			canvas: target,
			antialias: true
		});
		renderer.setPixelRatio(window.innerWidth / window.innerHeight);
		renderer.setSize(window.innerWidth, window.innerHeight);

		// シーンを作成
		const scene = new THREE.Scene();

		// カメラを作成
		const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight);
		camera.position.set(0, 0, 250);

		// ３つのグループを作成
		const group1 = new THREE.Group();
		scene.add(group1);
		const group2 = new THREE.Group();
		scene.add(group2);
		const group3 = new THREE.Group();
		scene.add(group3);

		// 上段
		for (let i = 0; i < 10; i++) {
			const geometry = new THREE.PlaneGeometry(160, 103);
			const loader = new THREE.TextureLoader();
			const texture = loader.load(`./assets/ss/${Object.keys(ssCards)[i]}.jpeg`);
			const material = new THREE.MeshBasicMaterial({ map: texture });
			const mesh = new THREE.Mesh(geometry, material);

			const radian = (i / 10) * Math.PI * 2;
			mesh.position.set(260 * Math.cos(radian), 110, 260 * Math.sin(radian));
			mesh.rotation.y = -radian - Math.PI / 2;

			group1.add(mesh);
		}

		// 中段
		for (let i = 10; i < 20; i++) {
			const geometry = new THREE.PlaneGeometry(160, 103);
			const loader = new THREE.TextureLoader();
			const texture = loader.load(`./assets/ss/${Object.keys(ssCards)[i]}.jpeg`);
			const material = new THREE.MeshBasicMaterial({ map: texture });
			const mesh = new THREE.Mesh(geometry, material);

			const radian = (i / 10) * Math.PI * 2;
			mesh.position.set(260 * Math.cos(radian), 0, 260 * Math.sin(radian));
			mesh.rotation.y = -radian - Math.PI / 2;

			group2.add(mesh);
		}

		// 下段
		for (let i = 20; i < 30; i++) {
			const geometry = new THREE.PlaneGeometry(160, 103);
			const loader = new THREE.TextureLoader();
			const texture = loader.load(`./assets/ss/${Object.keys(ssCards)[i]}.jpeg`);
			const material = new THREE.MeshBasicMaterial({ map: texture });
			const mesh = new THREE.Mesh(geometry, material);

			const radian = (i / 10) * Math.PI * 2;
			mesh.position.set(260 * Math.cos(radian), -110, 260 * Math.sin(radian));
			mesh.rotation.y = -radian - Math.PI / 2;

			group3.add(mesh);
		}

		const orbitControls = new OrbitControls(camera, renderer.domElement);
		orbitControls.enableDamping = true;
		orbitControls.dampingFactor = 0.2;
		orbitControls.enablePan = false;
		orbitControls.enableZoom = false;

		tick();

		// 毎フレーム時に実行されるループイベント
		function tick() {
			orbitControls.update();

			group1.rotation.y += 0.0006;
			group2.rotation.y -= 0.0006;
			group3.rotation.y += 0.0006;
			renderer.render(scene, camera); // レンダリング

			requestAnimationFrame(tick);
		}
	});
</script>

<div id="top">
	<section>
		<h1>速水奏さんカードイラストソート</h1>
		<p>速水奏さんカードイラストソートのトップページです。</p>
		<a href="/sort">始める</a>
	</section>

	<canvas id="myCanvas" />
</div>

<style lang="scss">
	#top {
		position: relative;
	}

	#myCanvas {
		position: absolute;
		top: 0;
		left: 0;
	}

	section {
		position: absolute;
		top: 0;
		left: 0;

		z-index: 2;

		> * {
			color: #fff;
		}
	}
</style>
