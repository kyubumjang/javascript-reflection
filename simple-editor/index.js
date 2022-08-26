(() => {
	document.querySelector('.bold').addEventListener('click', () => {
		document.execCommand('bold');
	});

	document.querySelector('.italic').addEventListener('click', () => {
		document.execCommand('italic');
	});
})();
