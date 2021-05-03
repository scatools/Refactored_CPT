function randn_bm() {
	let u = 0,
		v = 0;
	while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
	while (v === 0) v = Math.random();
	let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
	num = num / 10.0 + 0.5; // Translate to 0 -> 1
	if (num > 1 || num < 0) return randn_bm(); // resample between 0 and 1
	return num;
}

function Noise(means, standard) {
	return means.map((aoi) => {
		return aoi.map((mean) => {
			const result = mean + standard * (randn_bm() - 0.5) * 2;
			return result > 0 ? result : 0;
		});
	});
}

function possibleCase(means, standard) {
	let worst = [];
	let best = [];
	for (let i = 0; i < 5; i++) {
		const meanByGoal = [];
		means.forEach((aoi) => {
			meanByGoal.push(aoi[i]);
		});
		worst.push(Math.round((Math.min(...meanByGoal) - standard) * 100) / 100);
		best.push(Math.round((Math.max(...meanByGoal) + standard) * 100) / 100);
	}
	const diff = best.map((val, idx) => {
		return Math.round((val - worst[idx]) * 100) / 100;
	});
	return {
		worst,
		best,
		diff
	};
}

function randomWeights() {
	let random = Array(4).fill(0);
	random = random.map((val) => Math.random());
	random = random.sort();
	random.unshift(0);
	random.push(1);
	let result = Array(5).fill(0);
	result = result.map((val, idx) => {
		return random[idx + 1] - random[idx];
	});
	return result;
}

function Rank(value) {
	let test = value;
	// make list with indices and values
	let indexedTest = test.map(function(e, i) {
		return { ind: i, val: e };
	});
	// sort index/value couples, based on values
	indexedTest.sort(function(x, y) {
		return y.val - x.val;
	});
	// make list keeping only indices
	let indices = indexedTest.map(function(e) {
		return e.ind;
	});
	return indices;
}

function SMAA_MCDA(means = Init_mean, standard = Init_std, N = 100000) {
	let rankAccept = Array(means.length).fill().map(() => Array(means.length).fill(0));
	let centralWeight = Array(means.length).fill().map(() => Array(5).fill(0));

	const { worst, diff } = possibleCase(means, standard);
	for (let i = 0; i < N; i++) {
		// console.log('iteration', i)
		const weights = randomWeights();
		//Compare difference within iterations or outside
		const meansWithNoise = Noise(means, standard);
		const score = meansWithNoise.map((aoi) => {
			const data = aoi.map((val, idx) => {
				return weights[idx] * (val - worst[idx]) / diff[idx];
			});
			return data.reduce((a, b) => {
				return a + b;
			}, 0);
		});
		const rank = Rank(score);
		rank.forEach((val, idx) => {
			rankAccept[idx][val] += 1;
		});
		centralWeight[rank[0]] = centralWeight[rank[0]].map((val, idx) => val + weights[idx]);
	}
	centralWeight = centralWeight.map((val, idx) =>
		val.map((value) => {
			if (rankAccept[0][idx]) {
				return Math.round(value / rankAccept[0][idx] * 100) / 100;
			} else {
				return Math.round(value * 100) / 100;
			}
		})
	);
	rankAccept = rankAccept.map((val) => val.map((data) => data / N));
	return {
		rankAccept,
		centralWeight
	};
}

module.exports = SMAA_MCDA;
