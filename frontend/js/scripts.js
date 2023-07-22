const nextButton = document.getElementById("next");


nextButton.addEventListener("click", function(e){
    e.preventDefault();

    let email = document.getElementById("signin-email").value;

    // For example, using fetch:
    fetch('http://localhost/FullStackMiniProject/signin.php', {
        method: 'POST',
        body: JSON.stringify({ 
            email: email }),
    })
    .then(response => response.json())
    .then(data => {
        handleResponse(data);
    })
    .catch(error => {
        console.error('Error In Email API: ', error);
    });
});


function handleResponse(data){
    const response = data.status;
    switch (response){
        case 'this email does not exist':
            break
        case 'email found':
            let email_tab = document.querySelector(".signin-email");
            let password_tab = document.querySelector(".signin-password");

            email_tab.style.display = "none";
            password_tab.style.display = "flex";
            break;

        default : 
            console.log("handleResponse Error")
    }
}