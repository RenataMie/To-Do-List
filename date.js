

exports.getDate = function() {

	const today = new Date();
// new alternative for all that switch code
// 	var day = "";

// switch(today.getDay()) {
// 	case 0 :
// 	 	day= "Sunday!";
// 		break;
// 	case 1:
// 		day= "Monday!";
// 		break;
// 	case 2:
// 		day= "Tuesday!";
// 		break;
// 	case 3:
// 		day= "Wednesday!";
// 		break;
// 	case 4:
// 		day= "Thursday!";
// 		break;
// 	case 5:
// 		day= "Friday!";
// 		break;
// 	case 6:
// 		day= "Saturday!";
// 		break;
// 	default: 
// 	console.log("Error: current day is equal to: " + today.getDay());
// }
	const options = {
		timeZone: "America/Sao_Paulo",
		weekday: "short",
		day: "numeric",
		month: "long"
	};

	return today.toLocaleDateString("en-US", options);

};
