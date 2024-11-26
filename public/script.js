document.getElementById("finishSetButton").addEventListener("click", function (e) {
    e.preventDefault(); // Prevent the form from submitting immediately

    const button = this;

    // Add the 'clicked' class to change color
    button.classList.add("clicked");

    // Remove the 'clicked' class after 1 second
    setTimeout(() => {
        button.classList.remove("clicked");
        // Submit the form programmatically
        button.closest("form").submit();
    }, 1000); // Adjust delay for color change duration
});