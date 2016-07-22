var gameModule = (function() {
	var badWords = ["kitten","puppy","beer"];

	function hasBadWords(s) {
		for(var i=0;i<badWords.length; i++) {
			if(s.indexOf(badWords[i]) >= 0) return true;
		}
		return false;
	}

	function validIdentifier(s) {
		//is it blank?
		if(s === "") return false;
		//must be at least 2 chars
		if(s.length === 1) return false;
		//must begin with a capital letter
		if(s.charAt(0) !== s.charAt(0).toUpperCase()) return false;
		//only letters and spaces
		if(/[^a-z ]/i.test(s)) return false;
		//no bad words!
		if(hasBadWords(s)) return false;
		return true;
	}

	return {
		valid:validIdentifier
	}

}());

document.getElementById("submitButton").addEventListener("click", function(e) {

	var identifier = document.getElementById("identifer").value;

	if(gameModule.valid(identifier)) {
		console.log('true');
		return true;
	} else {
		console.log('false');
		e.preventDefault();
		return false;
	}
});
