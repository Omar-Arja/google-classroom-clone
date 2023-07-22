
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
                console.log(data.status)
            }).catch(error => console.log(error))
            
        }
    })
}
pages.myFetchSigninEmail= () =>{

    const nextButton = document.getElementById("next");

    nextButton.addEventListener("click", function(e){
    e.preventDefault();

    let email = document.getElementById("signin-email").value;


    const data = new FormData();
    data.append("email", email)
    

    fetch(pages.base_url + 'email.php', {
        method: 'POST',
        body:data
    })
    .then(response => response.json())
    .then(data => {
        pages.handleResponse(data)
    })

    .catch(error => 
        console.log('Error In Email API: ', error)
    );
});
}


pages.handleResponse = (data)=>{
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


pages.sidebar = () => {
    const open_sidebar = document.getElementById('sidebar-btn');
    const sidebarContainer = document.getElementById('mySidebar');
  
    open_sidebar.onclick = () => {
      // Toggle the 'show' class using if...else
      if (sidebarContainer.classList.contains('show')) {
        sidebarContainer.classList.remove('show');
      } else {
        sidebarContainer.classList.add('show');
      }
    };
  
    window.onclick = function (event) {
      // Check if the clicked element is the sidebar or its child element
      if (event.target === sidebarContainer || sidebarContainer.contains(event.target)) {
        sidebarContainer.classList.remove('show');
      }
    };
  };  
  
pages.userInfo = () => {
    const userIcon = document.querySelector('.userIcon');
    const userInfoTab = document.querySelector('.user-info-tab');

    userIcon.addEventListener('click', function(){
    if (userInfoTab.style.display === 'none') {
        userInfoTab.style.display = 'block';
        pages.displayUserInfo();
    } else {
        userInfoTab.style.display = 'none';
    }
    });
}

pages.displayUserInfo = () => {
    const userInfoContainer = document.querySelector('.user-info');
  
    const firstName = localStorage.getItem("first_name");
    const lastName = localStorage.getItem("last_name");
    const role = localStorage.getItem("role");
    const email = localStorage.getItem("email");
  
  
    const fullNameElement = document.getElementById("full-name-disp");
    const emailElement = document.getElementById("email-disp");
    const roleElement = document.getElementById("role-disp");
  
    fullNameElement.textContent = `${firstName} ${lastName}`;
    emailElement.textContent = `Email: ${email}`; 
    roleElement.textContent = `Role: ${role}`;
  };




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