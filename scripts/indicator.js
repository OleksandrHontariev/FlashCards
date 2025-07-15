		function Indicator ({dictionaryId, errorsIndicator}) {
			let { current, successes, errors } = getIndicatorByDictionaryId(dictionaryId);

			this.printIndicator = function () {
				print();
			};

			this.incrementCurrent = function () {
				if (current == total - 1) {
					refresh();
				} else {
					current++;
					saveIndicator();
				}
				print();
			};

			this.getIndicatorData = function () {
				return {
					current : current,
					successes : successes,
					errors: errors,
					total: total
				};
			}

			function print () {
				let c = current == total - 1 ? total : current + 1;
				document.querySelector(".indicator .current").innerText = c;
				document.querySelector(".indicator .success-count").innerText =
					errorsIndicator.getErrorsIndicator().filter(i => i === 0).length;

				document.querySelector(".indicator .errors-count").innerText = 
					errorsIndicator.getErrorsIndicator().filter(i => i > 0).length;

				document.querySelector(".indicator .total-count").innerText = total;
			}

			function refresh () {
				current = 0;
			}

			function getDictionaryLength (dictionaryId) {
				let data = localStorage.getItem(dictionaryId);
				if (data === null) {
					return 0;
				} else {
					return JSON.parse(data).length;
				}
			}

			function getIndicatorByDictionaryId (dictionaryId) {
				total = getDictionaryLength(dictionaryId);

				let data = localStorage.getItem(indicatorKey);
				if (data === null) {
					let indicator = createIndicator(dictionaryId, total);
					let indicatorList = [];
					indicatorList.push(indicator);
					localStorage.setItem(indicatorKey, JSON.stringify(indicatorList));
					return indicator;
				} else {
					let indicatorList = JSON.parse(data);
					let indicator = indicatorList.find(i => i.dictionaryId === dictionaryId) ?? null;
					if (indicator === null) {
						indicator = createIndicator(dictionaryId, total);
						indicatorList.push(indicator);
						localStorage.setItem(indicatorKey, JSON.stringify(indicatorList));
					}
					return indicator;
				}
			}

			function saveIndicator () {
				let indicatorData = localStorage.getItem(indicatorKey);
				if (indicatorData === null) {
					let indicatorList = [];
					indicatorList.push({
						dictionaryId: dictionaryId,
						current: current,
						successes: successes,
						errors: errors,
						total: total
					});
					localStorage.setItem(indicatorKey, JSON.stringify(indicatorList));
				} else {
					let indicatorList = JSON.parse(indicatorData);
					indicatorList = indicatorList.filter(i => i.dictionaryId != dictionaryId);
					indicatorList.push({
						dictionaryId: dictionaryId,
						current: current,
						successes: successes,
						errors: errors,
						total: total
					});
					localStorage.setItem(indicatorKey, JSON.stringify(indicatorList));
				}
			}

			function createIndicator (dictionaryId, total) {
				return {
					dictionaryId: dictionaryId,
					current: 0,
					successes: 0,
					errors: 0,
					total: total
				};
			}
		};

		Indicator.removeIndicator = function (dictionaryId) {
			let data = localStorage.getItem(indicatorKey);
			if (data !== null) {
				let toSave = JSON.parse(data).filter(i => i.dictionaryId != dictionaryId);
				if (toSave.length != 0) {
					localStorage.setItem(indicatorKey, JSON.stringify(toSave));
				} else localStorage.removeItem(indicatorKey);
			}
		}