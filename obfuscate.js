const fs = require('fs');

if (process.argv.length != 4) {
	console.log('2 arguments are required');
	console.log('npm start input_text_file output_text_file');
	return 1; 
}

var alphabet = [];
var words = [];

var getSourceCode = function() {
	var output = '#include <stdlib.h>\n#include <stdio.h>\n\n';

	var wordLengths = words.map(word => word.length);

	// print alphabet
	output += 'unsigned char alphabet['+alphabet.length+'] = {';
	output += alphabet.map((element, index) =>
		element.codePointAt(0)
	).join(', ');
	output += '};';
	output += "\n";

	// print words length
	output += 'unsigned char wordLengths['+words.length+'] = {';
	output += wordLengths.join(', ');
	output += '};';
	output += "\n";

	// print words
	var maxWordLength = Math.max.apply(null, wordLengths);
	output += 'unsigned char words['+words.length+']['+maxWordLength+'] = {' + "\n";
	output += words.map(word => "\t" + '{' + word.join(', ') + '}').join(",\n")

	output += "\n";
	output += '};';
	output += "\n\n";

	output += 'char* wordWithAlphabet(int wordNumber) {\n\
\tint wordLength = wordLengths[wordNumber];\n\
\tchar* newWord = malloc(wordLength);\n\
\tfor (int i = 0; i < wordLength; ++i) {\n\
\t\tnewWord[i] = alphabet[words[wordNumber][i]];\n\
\t}\n\
\tnewWord[wordLength] = \'\\0\';\
\treturn newWord;\n\
}\n\
	';
	output += "\n";

	output += "int main(int argc, char const *argv[]) {\n";
	for (var i = 0; i < words.length; i++) {
		output += '\tchar* word'+i+' = wordWithAlphabet('+i+');\n';
	}
	output += "\n";

	for (var i = 0; i < words.length; i++) {
		output += '\tprintf("%s\\n", word'+i+');\n';
	}
	output += "\n";

	for (var i = 0; i < words.length; i++) {
		output += '\tfree(word'+i+');\n';
	}
	output += "\n";
	output += "\treturn 0;\n";
	output += "}";

	return output;
}

fs.readFile(process.argv[2], 'ascii', (err, fileContents) => {
	if (err) throw err;
  
	alphabet = fileContents.split('').filter( (element, index, array) =>
		array.indexOf(element) == index
	);

	for (let i = alphabet.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [alphabet[i - 1], alphabet[j]] = [alphabet[j], alphabet[i - 1]];
    }

	words = fileContents.split("\n").map( (line, index) =>
		line.split('').map(letter => alphabet.indexOf(letter))
	);

	fs.writeFile(process.argv[3], getSourceCode(), (err) => {
	  if (err) throw err;
	});
});