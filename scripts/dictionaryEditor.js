function DictionaryEditor (dictionaryId, dictionarySavedHandler) {
	let hot = null;
	let data = convertDataToHandsontable(getDictionary());
	let buttonsContainer = document.getElementById("d-editor-btns");

	buttonsContainer.innerHTML = "";
	buttonsContainer.appendChild(createCancelButton());
	buttonsContainer.appendChild(createSaveButton());

	showEditor();


	function getDictionary () {
		let data = localStorage.getItem(dictionaryId);
		if (data === null) {
			return null;
		}
		return JSON.parse(data);
	}

	function convertDataToHandsontable (data) {
		if (!data) {
			return null;
		}
		let keys = Object.keys(data[0]);

		let excel = data.map(row => {
			let result = [];
			for (let key of keys) {
				result.push(row[key]);
			}
			return result;
		});
		return { headers: keys, data: excel};
	}

	function saveDictionary (dictionaryId, data) {
		if (dictionaryId && data && data.length > 0) {
			localStorage.setItem(dictionaryId, JSON.stringify(data));
			dictionarySavedHandler(dictionaryId);
		}
	}

	function getDataFromDictionaryRedactor () {
		let header = hot.getColHeader();
		let data = hot.getData();

		if (!header || header.length === 0 || !data || data.length == 0) {
			return;
		}

		data = data.filter(row => {
			let nullCount = row.filter(r => r === null).length;
			if (nullCount > 2) {
				return false;
			} else {
				return true;
			}
		});

		let dictionary = data.map(row => {
			let result = {};
			header.forEach((name, index) => {
				result[name] = row[index];
			});
			return result;
		});
		return dictionary;
	}

	function hideEditor () {
		document.querySelector(".dictionary-editor-modal").classList.add("d-none");
		if (hot !== null)
			hot.destroy();
	}

	function showEditor () {
		if (!data)
			return;

		const container = document.getElementById("dictionary_editor");
		document.querySelector(".dictionary-editor-modal").classList.remove("d-none");
		hot = new Handsontable(container, {
			themeName: 'ht-theme-main-dark-auto',
			data: data.data,
			width: '100%',
			rowHeaders: true,
			colHeaders: data.headers,
			height: 'auto',
			autoWrapRow: true,
			autoWrapCol: true,
			stretchH: 'all',
		    wordWrap: true,
		    colWidths: 150,
			contextMenu: true,           
			manualRowMove: true,         
			manualColumnMove: true,
			minSpareRows: 1,
			licenseKey: 'non-commercial-and-evaluation'
		});
	}

	function createSaveButton() {
		let button = document.createElement("button");
		button.type = "button";
		button.classList.add("btn", "btn-success", "btn-sm");
		button.addEventListener("click", function () {
			let data = getDataFromDictionaryRedactor();
			if (data != null && data.length > 0) 
				saveDictionary(dictionaryId, data);
			hideEditor();
		});
		button.innerText = "Сохранить";
		return button;
	}

	function createCancelButton() {
		let button = document.createElement("button");
		button.type = "button";
		button.style.marginRight = "6px";
		button.classList.add("btn", "btn-secondary", "btn-sm");
		button.addEventListener("click", hideEditor);
		button.innerText = "Отмена";
		return button;
	}
}