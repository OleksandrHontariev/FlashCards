		function ErrorsIndicator (dictionaryId) {
			let dictionary = getDictionary();
			let errorsIndicator = get();

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

		ErrorsIndicator.removeErrorsIndicator = function (dictionaryId) {
		    let list = JSON.parse(localStorage.getItem(errorsKey)) || [];
		    let filtered = list.filter(i => i.dictionaryId !== dictionaryId);
		    if (filtered.length !== 0) {
		    	localStorage.setItem(errorsKey, JSON.stringify(filtered));
		    } else {
		    	localStorage.removeItem(errorsKey);
		    }
		}