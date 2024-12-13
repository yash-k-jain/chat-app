const formattedJoinedDate = (date) => {
    const joinedDate = new Date(date);
    const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

    const month = months[joinedDate.getMonth()];
    const year = joinedDate.getFullYear();

    return `${month} ${year}`;
}

export default formattedJoinedDate