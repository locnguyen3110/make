document.getElementById('debForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const output = document.getElementById('output');

    fetch('/create-deb', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        output.innerHTML = data;
    })
    .catch(error => {
        console.error('Error:', error);
        output.innerHTML = 'An error occurred while creating the package.';
    });
});
