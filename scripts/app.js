
		document.addEventListener("DOMContentLoaded", function () {
			let ds = new DictionaryStorage();
			ds.printDictionaryList();

			document.getElementById("trigger-load-excel").addEventListener("click", function () {
				document.getElementById("load_excel").click();	
			});

			document.getElementById("load_excel").addEventListener("change", function (e) {
				startLoadingFile();
				const file = e.target.files[0];
				const reader = new FileReader();

				reader.onload = function (event) {
					const data = new Uint8Array(event.target.result);
					const workbook = XLSX.read(data, { type: 'array' });
				    const firstSheetName = workbook.SheetNames[0];
				    const worksheet = workbook.Sheets[firstSheetName];

				    // Конвертируем лист в JSON
				    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
				    let dictionaryId = ds.generateDictionaryId();
				    let dictionaryName = file.name.split(".")[0];
				    ds.saveDictionary(dictionaryId, jsonData, dictionaryName);
				    // ds.printDictionaryList();
				    ds.addDictionaryToSidebar(dictionaryId, dictionaryName);
				    document.getElementById("load_excel").value = '';
				    endLoadingFile();
				};
				reader.readAsArrayBuffer(file);
			}); // load_excel

			const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
			tooltipTriggerList.forEach(function (tooltipTriggerEl) {
			new bootstrap.Tooltip(tooltipTriggerEl);
			});

		}); // DOMContentLoaded

		function startLoadingFile () {
			let btn = document.getElementById("trigger-load-excel");
			btn.querySelector(".spinner-border").classList.add("d-none");
			btn.disabled = true;
		}

		function endLoadingFile () {
			let btn = document.getElementById("trigger-load-excel");
			btn.querySelector(".spinner-border").classList.add("d-none");
			btn.disabled = false;
		}