interface Card {
	less: string[];
	equal: string[];
	greater: string[];
}

interface CardDictionary {
	[id: string]: Card;
}

class UndefinedOrderError extends Error {}

export default class Sorter {
	items: CardDictionary = {};
	prevItems: CardDictionary = {};
	backable = false;
	protected _array: string[];
	protected _lastChallenge: string[] = [];
	protected _currentRound = 0;

	constructor(array: string[]) {
		this._array = this.shuffle(array);
		for (const item of this._array) {
			this.items[item] = {
				less: [],
				equal: [],
				greater: []
			};
		}
	}

	get progress() {
		const rounds = this._array.length * (this._array.length - 1);
		let current = 0;
		for (const name of this._array) {
			current += this.items[name].equal.length;
			current += this.items[name].greater.length;
			current += this.items[name].less.length;
		}

		return Math.round(Math.sqrt(current / rounds) * 100 * 10) / 10;
	}

	get array() {
		return this._array;
	}

	get lastChallenge() {
		return this._lastChallenge;
	}

	get currentRound() {
		return this._currentRound;
	}

	sort() {
		try {
			this._array = this.fordJohnson(this._array.concat());
			return true;
		} catch (e) {
			if (e instanceof UndefinedOrderError) {
				this._currentRound++;
				return false;
			} else {
				console.error(e);
				return false;
			}
		}
	}

	back() {
		this.items = JSON.parse(JSON.stringify(this.prevItems));
		this.backable = false;
		this._currentRound = this._currentRound - 2;
	}

	addResult(greater: string, less: string) {
		if (!(this._array.includes(less) && this._array.includes(greater))) {
			console.log(this._array);
			throw new Error('不正な値です' + String(less) + '/' + String(greater));
		}
		if (less === greater) {
			return;
		}

		if (this.notExist(greater, less)) {
			this.items[less].greater.push(greater);
			for (const item of this.items[less].equal) {
				this.addResult(greater, item);
			}
			for (const item of this.items[less].less) {
				this.addResult(greater, item);
			}
		}

		if (this.notExist(less, greater)) {
			this.items[greater].less.push(less);
			for (const item of this.items[greater].equal) {
				this.addResult(item, less);
			}
			for (const item of this.items[greater].greater) {
				this.addResult(item, less);
			}
		}
	}

	addEqual(val1: string, val2: string) {
		if (!(this._array.includes(val1) && this._array.includes(val2))) {
			throw new Error('不正な値です');
		}
		if (val1 === val2) {
			return;
		}
		if (this.notExist(val2, val1)) {
			this.items[val1].equal.push(val2);
			for (const item of this.items[val1].equal) {
				this.addEqual(item, val2);
			}
		}
		if (this.notExist(val1, val2)) {
			this.items[val2].equal.push(val1);
			for (const item of this.items[val2].equal) {
				this.addEqual(item, val1);
			}
		}

		for (const item of this.items[val1].greater) {
			this.addResult(item, val2);
		}
		for (const item of this.items[val1].less) {
			this.addResult(val2, item);
		}
		for (const item of this.items[val2].greater) {
			this.addResult(item, val1);
		}
		for (const item of this.items[val2].less) {
			this.addResult(val1, item);
		}
	}

	rank(card: string) {
		let rank = 1;
		let continueFlag = true;
		for (let i = 0; i < this.array.length && continueFlag; i++) {
			continueFlag = this.array[i] !== card;
			if (i > 0) {
				if (this.items[this.array[i]].equal.includes(this.array[i - 1])) {
					continue;
				}
			}
			rank = i + 1;
		}
		return rank;
	}

	private notExist(item: string, dest: string) {
		return !(
			this.items[dest].equal.includes(item) ||
			this.items[dest].greater.includes(item) ||
			this.items[dest].less.includes(item)
		);
	}

	protected shuffle([...arr]) {
		let m = arr.length;
		while (m) {
			const i: number = Math.floor(Math.random() * m--);
			[arr[m], arr[i]] = [arr[i], arr[m]];
		}

		return arr;
	}

	protected compare(greater: string, less: string) {
		this._lastChallenge = [greater, less];
		if (greater === less) {
			return false;
		}
		if (this.items[greater].less.includes(less)) {
			return true;
		} else if (
			this.items[greater].equal.includes(less) ||
			this.items[greater].greater.includes(less)
		) {
			return false;
		} else {
			throw new UndefinedOrderError();
		}
	}

	protected fordJohnson = (arr: string[]): string[] => {
		const JACOBSTHAL = [
			1, 3, 5, 11, 21, 43, 85, 171, 341, 683, 1365, 2731, 5461, 10923, 21845, 43691, 87381, 174763,
			349525
		];

		const binaryInsertion = (collection: string[], item: string): string[] => {
			if (collection.length === 1) {
				if (this.compare(item, collection[0])) {
					return [item, collection[0]].concat();
				} else {
					return [collection[0], item].concat();
				}
			} else if (collection.length === 2) {
				if (this.compare(item, collection[0])) {
					return [item].concat(collection);
				} else if (this.compare(item, collection[1])) {
					return [collection[0], item, collection[1]].concat();
				} else {
					return collection.concat([item]);
				}
			}

			let result: string[] = [];
			let pivot = 0;
			let left = 0;
			let right = collection.length - 1;

			while (left < right - 1) {
				pivot = Math.floor((left + right) / 2);
				if (this.compare(item, collection[pivot])) {
					right = pivot;
				} else {
					left = pivot;
				}
			}

			result = collection;

			if (left === 0) {
				if (this.compare(item, collection[left])) {
					return [item].concat(result);
				}
			}

			if (right === collection.length - 1) {
				if (this.compare(collection[right], item)) {
					return result.concat([item]);
				}
			}

			result.splice(right, 0, item);
			return result;
		};

		if (arr.length < 2) {
			return arr.concat();
		} else if (arr.length === 2) {
			if (this.compare(arr[0], arr[1])) {
				return [arr[0], arr[1]].concat();
			} else {
				return [arr[1], arr[0]].concat();
			}
		}

		const pairs: string[][] = [];
		let pairKeys: string[] = [];
		const surplus: string[] = [];

		for (let i = 0; i < arr.length; i = i + 2) {
			if (i === arr.length - 1) {
				surplus.push(arr[i]);
			} else if (this.compare(arr[i], arr[i + 1])) {
				pairs.push([arr[i + 1], arr[i]]);
				pairKeys.push(arr[i + 1]);
			} else {
				pairs.push([arr[i], arr[i + 1]]);
				pairKeys.push(arr[i]);
			}
		}

		const sortedPairs: string[][] = [];
		pairKeys = this.fordJohnson(pairKeys);
		for (const key of pairKeys) {
			for (const pair of pairs) {
				if (pair[0] === key) {
					sortedPairs.push(pair);
					break;
				}
			}
		}
		let result = pairKeys;

		const insertOrder: number[] = [];
		for (let i of JACOBSTHAL) {
			i = i - 1;
			if (i >= sortedPairs.length) {
				for (let j = sortedPairs.length - 1; j >= 0; j--) {
					if (!insertOrder.some((num) => num === j)) {
						insertOrder.push(j);
					}
				}

				break;
			}
			insertOrder.push(i);
			for (let j = i; j >= 0; j--) {
				if (!insertOrder.some((num) => num === j)) {
					insertOrder.push(j);
				}
			}
		}

		for (const i of insertOrder) {
			const pair = sortedPairs[i];
			let pivot: number;
			for (pivot = 0; pivot < result.length; pivot++) {
				if (result[pivot] === pair[0]) {
					break;
				}
			}

			if (pivot === 0) {
				result = [pair[1]].concat(result);
			} else {
				result = binaryInsertion(result.slice(0, pivot), pair[1]).concat(result.slice(pivot));
			}
		}

		if (surplus.length > 0) {
			result = binaryInsertion(result, surplus[0]);
		}

		return result;
	};
}
