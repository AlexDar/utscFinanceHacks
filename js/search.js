// Create random string of length x
function randString(x){
    var s = "";
    while(s.length<x&&x>0){
        var r = Math.random();
        s+= (r<0.1?Math.floor(r*100):String.fromCharCode(Math.floor(r*26) + (r>0.5?97:65)));
    }
    return s;
}

// Get company lists
var tsx = TSXjson.Companies;
var nys = NYSjson.Companies;
var nas = NASjson.Companies;

// Free up memory
TSXjson = null;
NASjson = null;
NYSjson = null;


// Initialize universal list to store company names from NYC, NASDAQ, TSX
var final = [];

// Collect names from each exchange
for (i = 0; i < nys.length; i++){
	final.push(nys[i].Name);
}
for (i = 0; i < nas.length; i++){
	final.push(nas[i].Name);
}
for (i = 0; i < tsx.length; i++){
	final.push(tsx[i].Name);
}

/*
for (i = 0; i < 25000000; i++){
	final.push(randString(3));
}
*/


// Free up memory
nas = null;
tsx = null;
nys = null;

final.sort();


console.log(final.length);


// Build dictionary to store the index of each first letter
var firstCharsIndexDict = {"0": 0};
var previousLetter = "0";
for (i = 0; i < final.length; i++){
	if (final[i][0].toLowerCase() > previousLetter){
		firstCharsIndexDict[final[i][0].toLowerCase()] = i;
		previousLetter = final[i][0].toLowerCase();
	}
}

// Primary search function
function matchPercent(query){

	// Front end stuff
	if (query == "") {
		$('#autofill').addClass('hidden');
	} else {
		if ($('#autofill').hasClass('hidden')){
			$('#autofill').removeClass('hidden');
		}
	}
	// starting index denoted by the index of the first character (ie 'a')
	var i = 0;

	// Ending index denoted by the index of the next first character (ie 'b')
	var endIndex = 7174;

	// Initializing vars to track quality of match
	var suggestion, ind;

	// First character of query in lowercase
	var firstQueryChar = query[0].toLowerCase();

	for (j = 0; j < query.length; j++){
		binarySearchByChar(i, final.length, query, j);
	}

	// Search for the first occurance of query at the start of a company name
	while (i < endIndex && final[i].toLowerCase().indexOf(query.toLowerCase()) != 0){
		i += 1;
	}
	if (final[i].toLowerCase().indexOf(query.toLowerCase()) == 0){
	  suggestion = final[i];
  }
	// Front end stuff
	if (!suggestion) {
		$('#autofill').addClass('hidden');
	} else {
		if ($('#autofill').hasClass('hidden')){
			$('#autofill').removeClass('hidden');
		}
		$('#autofill').val(suggestion);
	}

	// Single company name
	return suggestion;
}

/*
 * Computes the range where the letter at charPosition of query occurs within search domain (list).
 *
 * returns (String) representing the most likely word on this iteration
 */
function binarySearchByChar(startInd, endInd, query, charPosition){
	var midInd = Math.floor((endInd - startInd) / 2) + startInd;
	var midChar = final[midInd][charPosition].toLowerCase();
	var queryChar = query[charPosition].toLowerCase();

	if (midChar < queryChar){
  	    i = midInd - 1;
  	    return binarySearchByChar(i, endInd, query, charPosition);
    } else if (midChar > queryChar){
    	endIndex = midInd + 1;
    	return binarySearchByChar(startInd, endIndex, query, charPosition);
    } else {

    	// Gets earliest occurance s
    	j = 1;
    	while (final[j + midInd][charPosition].toLowerCase() == queryChar){
    		j += 1;
    	}

    	k = 0;
    	while (final[midInd - k][charPosition].toLowerCase() == queryChar){
    		k += 1;
    	}

    	i = midInd - k + 1;
    	endIndex = midInd + j - 1;

    	console.log(final[Math.floor((endIndex - i) / 2) + startInd]);
      	return final[Math.floor((endIndex - i) / 2) + startInd];
    }
}


  $(document).ready(function(){
            var submitIcon = $('.searchbox-icon');
            var inputBox = $('.searchbox-input');
            var searchBox = $('.searchbox');
            var isOpen = false;
            submitIcon.click(function(){
                if(isOpen == false){
                    searchBox.addClass('searchbox-open');
                    inputBox.focus();
                    isOpen = true;
                } else {
                    searchBox.removeClass('searchbox-open');
                    inputBox.focusout();
                    isOpen = false;
                }
            });  
             submitIcon.mouseup(function(){
                    return false;
                });
            searchBox.mouseup(function(){
                    return false;
                });

            $(document).mouseup(function(){
                    if(isOpen == true){
                        $('.searchbox-icon').css('display','block');
                        submitIcon.click();
                    }
                });
        });
            function buttonUp(){
                var inputVal = $('.searchbox-input').val();
                console.log(matchPercent(inputVal));
                inputVal = $.trim(inputVal).length;
                if( inputVal !== 0){
                   //$( '.searchbox-icon').css('display','none');
                } else {
                    $('.searchbox-input').val('');
                    $('.searchbox-icon').css('display','block');
                }
            }