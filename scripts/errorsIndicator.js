		function ErrorsIndicator (dictionaryId) {
			let dictionary = getDictionary();
			let errorsIndicator = get();
			let visualizerContainer = document.getElementById("word_visualizer");
			createVisualizer();

			this.indicate = function (current, success) {
				let value = errorsIndicator[current];
				if (success) {
					if (value < 0 || value === 0) {
						value = 0;
					} else {
						value -= 1;
					}
				} else {
					value = errorCountPerWord;
				}
				errorsIndicator[current] = value;
				save();
			}

			this.getErrorsIndicator = function () {
				return errorsIndicator;
			}

			this.reviewVisualizer = function () {
				let divs = visualizerContainer.querySelectorAll("div");
				errorsIndicator.forEach((e, i) => {
					// clear
					divs[i].classList.remove("word-success");
					divs[i].classList.remove("word-error");

					if (e === 0) {
						divs[i].classList.add("word-success");
					} else if (e > 0) {
						divs[i].classList.add("word-error");
					}
				});
			}

			this.setCurrentWord = function (current) {
				// clear
				visualizerContainer.querySelectorAll("div").forEach ((div) =>  {
					div.classList.remove("word-current");
				});

				visualizerContainer.querySelectorAll("div").forEach ((div, index) =>  {
					if (index === current) {
						div.classList.add("word-current");
					}
				});
			}

			function createVisualizer () {
				visualizerContainer.innerHTML = "";

				errorsIndicator.forEach((e, i) => {
					let div = document.createElement("div");
					if (e === 0) {
						div.classList.add("word-success");
					} else if (e > 0) {
						div.classList.add("word-error");
					}
					visualizerContainer.appendChild(div);
				});
			}

			function createErrorsIndicator () {
				let errorsIndicator = [];
				for (let i = 0; i < dictionary.length; i++) {
					errorsIndicator[i] = -1;
				}
				return errorsIndicator;
			}

			function getDictionary () {
				let data = localStorage.getItem(dictionaryId);
				if (data === null) {
					return null;
				} else {
					return JSON.parse(data);
				}
			}

			function get () {
				let data = localStorage.getItem(errorsKey);
				if (data === null) {
					let list = [];
					let errorsIndicator = createErrorsIndicator();
					list.push({ dictionaryId: dictionaryId, errorsIndicator: errorsIndicator });
					localStorage.setItem(errorsKey, JSON.stringify(list));
					return errorsIndicator;
				}
				else {
					let list = JSON.parse(data);
					let found = list.find(er => er.dictionaryId === dictionaryId) ?? null;
					if (found === null) {
						let errorsIndicator = createErrorsIndicator();
						list.push({ dictionaryId: dictionaryId, errorsIndicator: errorsIndicator });
						localStorage.setItem(errorsKey, JSON.stringify(list));
						return errorsIndicator;
					}
					return found.errorsIndicator;
				}
			}

			function save () {
			    let list = JSON.parse(localStorage.getItem(errorsKey)) || [];
			    let filtered = list.filter(i => i.dictionaryId !== dictionaryId);
			    filtered.push({ dictionaryId, errorsIndicator });
			    localStorage.setItem(errorsKey, JSON.stringify(filtered));
			}
		}

		// static
		ErrorsIndicator.removeErrorsIndicator = function (dictionaryId) {
		    let list = JSON.parse(localStorage.getItem(errorsKey)) || [];
		    let filtered = list.filter(i => i.dictionaryId !== dictionaryId);
		    if (filtered.length !== 0) {
		    	localStorage.setItem(errorsKey, JSON.stringify(filtered));
		    } else {
		    	localStorage.removeItem(errorsKey);
		    }
		    document.getElementById("word_visualizer").innerHTML = "";
		}