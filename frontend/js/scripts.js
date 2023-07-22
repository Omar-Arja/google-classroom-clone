const nextButton = document.getElementById("next");


nextButton.addEventListener("click", function(e){
    e.preventDefault();

    let email = document.getElementById("signin-email").value;


    const data = new FormData();
    data.append("email", email)

    fetch('http://localhost/FullStackMiniProject/signin.php', {
        method: 'POST',
        body:data
    })
    .then(response => response.json())
    .then(data => handleResponse(data))

    .catch(error => 
        console.log('Error In Email API: ', error)
    );
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