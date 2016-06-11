$(document).ready(function () {
// Link to Firebase
	var trainData = new Firebase("https://sizzling-torch-2283.firebaseio.com/");
	$('#trainInfo').validate({
		rules:{
			startInput: {
				required: true,
				time: true
			}
		}
	});

	// Button for adding trains
	$("#addTrainBtn").on("click", function(){

		// Grabs user input
		var trainName = $("#trainNameInput").val().trim();
		var trainDest = $("#destInput").val().trim();
		var trainStart = $("#startInput").val().trim();
		var trainFreq = $("#freqInput").val().trim();

		// Creates local object for holding train data
		var newTrain = {
			name:  trainName,
			dest: trainDest,
			start: trainStart,
			freq: trainFreq
		}

		// Uploads train data to the database
		trainData.push(newTrain);

		// Clears all of the text-boxes
		$("#trainNameInput").val("");
		$("#destInput").val("");
		$("#startInput").val("");
		$("#freqInput").val("");

		// Prevents moving to new page after form submit
		return false;
	});


	// Create Firebase event for adding train to the database and a row in the html when a user adds an entry
	trainData.on("child_added", function(childSnapshot, prevChildKey){

		console.log(childSnapshot.val());

		// Store everything into a variable.
		var trainName = childSnapshot.val().name;
		var trainDest = childSnapshot.val().dest;
		var trainStart = childSnapshot.val().start;
		var trainFreq = childSnapshot.val().freq;

		//Convert start time to moment.js object
		var firstTimeConverted = moment(trainStart,"hh:mm").subtract(1, "years");

		// Current Time
		var currentTime = moment();

		// Difference between the times
		var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

		// Time apart (remainder)
		var tRemainder = diffTime % trainFreq; 

		// Minute Until Train
		var tMinutesTillTrain = trainFreq - tRemainder;

		// Next Train
		var nextTrain = moment().add(tMinutesTillTrain, "minutes");
		nextTrain = moment(nextTrain).format("hh:mm a, MMMM Do YYYY");

		// Add each train's data into the table
		$("#trainTable > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>" + trainFreq + "</td><td>" + nextTrain + "</td><td>" + tMinutesTillTrain + "</td></tr>");

	});
})
