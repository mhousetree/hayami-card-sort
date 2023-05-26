<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
	import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
	import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass';
	import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass';
	import { ssCards } from '../data/ss';

	onMount(() => {
		// overflow: hidden
		document.querySelector('html')!.style.overflow = 'hidden';

		document.getElementById('toggle')?.addEventListener('click', () => {
			const targets: NodeListOf<HTMLElement> = document.querySelectorAll('.toggle-hide');

			for (const target of targets) {
				if (target.style.visibility !== 'hidden') {
					target.style.visibility = 'hidden';
				} else {
					target.style.visibility = 'visible';
				}
			}
		});

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
			alpha: true,
			antialias: true
		});
		renderer.setPixelRatio(window.innerWidth / window.innerHeight);
		renderer.setSize(window.innerWidth, window.innerHeight);

		// シーンを作成
		const scene = new THREE.Scene();

		scene.background = new THREE.Color(0xffffff);

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

			const material = new THREE.MeshStandardMaterial({ map: texture });
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
			const material = new THREE.MeshStandardMaterial({ map: texture });
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
			const material = new THREE.MeshStandardMaterial({ map: texture });
			const mesh = new THREE.Mesh(geometry, material);

			const radian = (i / 10) * Math.PI * 2;
			mesh.position.set(260 * Math.cos(radian), -110, 260 * Math.sin(radian));
			mesh.rotation.y = -radian - Math.PI / 2;

			group3.add(mesh);
		}

		const ambientLight = new THREE.AmbientLight(0xffffff);
		scene.add(ambientLight);

		const orbitControls = new OrbitControls(camera, renderer.domElement);
		orbitControls.maxPolarAngle = Math.PI / 2;
		orbitControls.minPolarAngle = Math.PI / 2;
		orbitControls.enableDamping = true;
		orbitControls.dampingFactor = 0.2;
		orbitControls.enablePan = false;
		orbitControls.enableZoom = false;

		const composer = new EffectComposer(renderer);

		const renderPass = new RenderPass(scene, camera);
		composer.addPass(renderPass);

		const bokehPass = new BokehPass(scene, camera, {
			focus: 510,
			aperture: 0.0001,
			maxblur: 0.003
		});

		let aaPass = new SMAAPass(
			window.innerWidth * renderer.getPixelRatio(),
			window.innerHeight * renderer.getPixelRatio()
		);
		aaPass.renderToScreen = true;
		composer.addPass(aaPass);
		composer.addPass(bokehPass);

		tick();

		// 毎フレーム時に実行されるループイベント
		function tick() {
			orbitControls.update();

			group1.rotation.y += 0.0006;
			group2.rotation.y -= 0.0006;
			group3.rotation.y += 0.0006;
			composer.render();
			requestAnimationFrame(tick);
		}
	});
</script>

<div id="top">
	<div id="switch">
		<input type="checkbox" id="toggle" name="toggle" />
		<label for="toggle">
			<svg
				width="125"
				height="125"
				viewBox="0 0 125 125"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				id="crescent"
			>
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M29.5 95C65.6747 95 95 65.6747 95 29.5C95 19.1545 92.6015 9.36916 88.3302 0.669762C110.05 11.3336 125 33.6709 125 59.5C125 95.6747 95.6747 125 59.5 125C33.6709 125 11.3336 110.05 0.669762 88.3302C9.36916 92.6015 19.1545 95 29.5 95Z"
					fill="white"
				/>
			</svg>
			<svg
				width="131"
				height="131"
				viewBox="0 0 131 131"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				id="fullmoon"
			>
				<circle cx="65.5" cy="65.5" r="65.5" fill="white" />
			</svg>
		</label>
	</div>

	<section class="toggle-hide">
		<h1>速水奏さんカードイラストソート</h1>
		<p>
			速水奏さんのカードイラストを比較して、<br class="sp-only" />好きな方を選んでください。<br />
			最後まで遊ぶと全カードのランキングが見られます。<br />
			あなたが速水奏さんのどんな部分が好きなのか<br class="sp-only" />向き合ってみましょう。
		</p>
		<a href="/sort">はじめる！</a>
	</section>

	<canvas id="myCanvas" />
	<div />

	<small class="toggle-hide">
		2023 &copy; はやかわめぐる<br />
		当コンテンツ内の画像およびカードタイトルの著作権は<br
			class="sp-only"
		/>ゲーム提供元に帰属します。<br />
		問題が発生した場合は速やかに当コンテンツの<br class="sp-only" />公開を終了します。
	</small>
</div>

<style lang="scss">
	#top {
		position: relative;
		width: 100%;
		height: 100dvh;

		#switch {
			position: absolute;
			top: 1rem;
			right: 1rem;
			z-index: 2;
			display: flex;

			input {
				width: 0;
				height: 0;
				opacity: 0;

				&:checked + label {
					#crescent {
						display: none;
					}
					#fullmoon {
						display: inline;
					}
				}
			}

			label {
				width: 1.5rem;
				height: 1.5rem;

				svg {
					width: 100%;
					height: 100%;
					overflow: visible;

					filter: drop-shadow(0 0 10px #0006);
				}
			}

			#crescent,
			#fullmoon {
				display: block;
			}

			#fullmoon {
				display: none;
			}
		}

		section {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			text-align: center;
			z-index: 2;
			width: max-content;
			filter: drop-shadow(0 0 3px #fff) drop-shadow(0 0 10px #fff) drop-shadow(0 0 30px #fff)
				drop-shadow(0 0 50px #fff);

			h1 {
				font-size: min(4vw, 3rem);
				margin-bottom: 1.5rem;
			}

			a {
				position: relative;
				display: block;
				width: fit-content;
				margin: 2rem auto 0;
				padding: 0.5rem 0.7rem 0.5rem 1rem;
				border-radius: 4px;
				font-size: 1.2rem;
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
		}
	}

	#myCanvas {
		position: absolute;
		top: 0;
		left: 0;

		+ div {
			content: '';
			display: block;
			position: absolute;
			top: 0;
			left: 0;
			width: 100vw;
			height: 100dvh;
			background: radial-gradient(transparent 50%, #ccc);
			pointer-events: none;
		}
	}

	small {
		font-size: 0.8rem;
		position: absolute;
		bottom: 1rem;
		left: 50%;
		z-index: 2;
		translate: -50% 0;
		text-align: center;
		width: max-content;
		color: #888;
	}

	.sp-only {
		display: none;
	}

	@media screen and (max-width: 700px) {
		.sp-only {
			display: block;
		}

		#top {
			font-size: 14px;
			section,
			small {
				width: 100%;
			}

			section {
				h1 {
					font-size: 1.5em;
				}
			}

			small {
				font-size: 0.6em;
			}
		}
	}
</style>
