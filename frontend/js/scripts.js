
const pages = {}

pages.base_url = 'http://localhost/GoogleClassroom/'

pages.myFetchSignup = () => {
        const signup_btn = document.getElementById('signup-btn')
        signup_btn.addEventListener('click', (e) =>{
        e.preventDefault()
        const first_name = document.getElementById('first-name-input')
        const last_name = document.getElementById('last-name-input')
        const email = document.getElementById('email-input')
        const password = document.getElementById('password-input')
        const ver_password = document.getElementById('ver-pass-input')
        
        // const role = document.getElementsByName('role')
        // let chosen_role = ''
        
        // for (i = 0; i < role.length; i++) {
        //     if (role[i].checked)
        //         chosen_role = role[i].value
        // }
        
        const first_name_val = first_name.value
        const last_name_val = last_name.value
        const email_val = email.value
        const password_val = password.value
        const ver_password_val = ver_password.value
        
        if ((password_val == ver_password_val) && first_name_val
            && last_name_val && email_val && password_val && ver_password_val){
            
            const signup_data = new FormData()
            signup_data.append('first_name', first_name_val)
            signup_data.append('last_name', last_name_val)
            signup_data.append('email', email_val)
            signup_data.append('password', password_val)
            // signup_data.append('role', chosen_role)
            
            fetch(pages.base_url + 'signup.php', {
                method: 'POST',
                body: signup_data,
                // redirect: 'follow',
            }).then(response => response.json())
            .then(data => {
                if (data.status == 'signed up successfully'){
                    window.location.href='index.html'
                }
            }).catch(error => console.log(error))
            
        }
    })
}
pages.myFetchSigninEmail= () =>{

    const nextButton = document.getElementById("next");

    nextButton.addEventListener("click", function(e){
    e.preventDefault();

    let email = document.getElementById("signin-email").value;

    if (email===''){
        let warning = document.getElementById("signin-email");
        warning.style.backgroundColor = 'lightcoral';
    }

    const data = new FormData();
    data.append("email", email)
    

    fetch(pages.base_url + 'email.php', {
        method: 'POST',
        body:data
    })
    .then(response => response.json())
    .then(data => {
        pages.handleResponse(data, email)
    })

    .catch(error => 
        console.log('Error In Email API: ', error)
    );
});
}

pages.myFetchSigninPassword = () => {
    const password_next_btn = document.getElementById('password-next');
    const showPasswordCheckbox = document.getElementById('showPassword');
    const password = document.getElementById('signin-password')

    showPasswordCheckbox.addEventListener("change", function(){
      if (showPasswordCheckbox.checked) {
            password.type = 'text';
          } else {
            password.type = 'password';
          }  
    })

    password_next_btn.addEventListener('click', e => {
        e.preventDefault()
        const password = document.getElementById('signin-password')
        const password_val = password.value
        

        const pass_data = new FormData()
        pass_data.append('email', localStorage.getItem('email'))
        pass_data.append('password', password_val)

        fetch(pages.base_url + 'password.php', {
            method: 'POST',
            body:pass_data
        }).then(response => response.json())
        .then(data => {
            pages.handleResponse(data)
        }).catch(error => 
            console.log('Error In Email API: ', error)
        )
    })
}
pages.handleResponse = (data, email=null)=>{
    const response = data.status;
    switch (response){
        case 'this email does not exist' || 'wrong password':
            break
        case 'email found':

            localStorage.setItem('email', email)
            let email_tab = document.querySelector(".signin-email");
            let password_tab = document.querySelector(".signin-password");

            email_tab.style.display = "none";
            password_tab.style.display = "flex";
            
            let email_text = document.getElementById("email")
            email_text.innerText = email
            break;

        case 'logged in':
            localStorage.setItem('first_name', data.first_name)
            localStorage.setItem('last_name', data.last_name)
            localStorage.setItem('role', data.role)
            
            
            break
        default : 
            console.log("handleResponse Error")
    }
}


pages.openSidebar = () => {
    const open_sidebar = document.getElementById('sidebar-btn')
    const sidebar = document.getElementById('mySidebar')
    open_sidebar.onclick = () => {
        sidebar.classList.add('show');
    }
}

pages.closeSidebar = () => {
    const sidebar = document.getElementById('mySidebar')
    
    window.onclick = function(event) {
        if (event.target == sidebar) {
            sidebar.classList.remove('show');
        }
    }

}

pages.addClassCard = (class_name, class_section, class_link) => {
    return `
    <div class="class-card">
        <div class="class-card-background-image">
            <div class="class-title-section">
                <a href="${class_link}" class="class-title">${class_name}</a>
                <a href="${class_link}" class="class-section">${class_section}</a>
            </div>
        </div>
    </div>
    `
}