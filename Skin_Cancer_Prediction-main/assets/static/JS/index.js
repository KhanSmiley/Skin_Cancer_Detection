document.getElementById("btn").addEventListener("click", function() {
    const url = "{{ url_for('form') }}";
    console.log("Navigating to:", url); // Check the URL in the console
    window.location.href = url; 
});