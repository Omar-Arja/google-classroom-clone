const pages = {};


class Class {
  constructor(class_id, class_name, class_section, class_subject, class_room, total_students_number, class_code, role) {
    this.class_id = class_id;
    this.class_name = class_name;
    this.class_section = class_section;
    this.class_subject = class_subject;
    this.class_room = class_room;
    this.total_students_number = total_students_number;
    this.class_code = class_code;
    this.role = role;
  }

  displayClassCard() {
    return `
      <div class="class-card">
        <div class="class-card-background-image">
          <div class="class-title-section">
            <a href="#" class="class-title">${this.class_name}</a>
            <a href="#" class="class-section">${this.class_section}</a>
          </div>
        </div>
      </div>
    `;
  }

  addSideBarItem () {
    return `
    <div class="sidebar-class">
    <img
      class="class-icon"
      src="../assets/Images/default-profile-icon.jpg"
      alt="Default Icon"
    />
    <div class="sidebar-class-details">
      <span class="sidebar-class-name">${this.class_name}</span>
      <span class="sidebar-class-section">${this.class_section}</span>
    </div>
    </div>
      `;
  };

}



pages.base_url = "http://localhost/google-classroom-clone/backend/api/";

pages.myFetchSignup = () => {
  const signup_btn = document.getElementById("signup-btn");
  signup_btn.addEventListener("click", (e) => {
    e.preventDefault();
    const first_name = document.getElementById("first-name-input");
    const last_name = document.getElementById("last-name-input");
    const email = document.getElementById("email-input");
    const password = document.getElementById("password-input");
    const ver_password = document.getElementById("ver-pass-input");

    // const role = document.getElementsByName('role')
    // let chosen_role = ''

    // for (i = 0; i < role.length; i++) {
    //     if (role[i].checked)
    //         chosen_role = role[i].value
    // }

    const first_name_val = first_name.value;
    const last_name_val = last_name.value;
    const email_val = email.value;
    const password_val = password.value;
    const ver_password_val = ver_password.value;

    if (
      password_val == ver_password_val &&
      first_name_val &&
      last_name_val &&
      email_val &&
      password_val &&
      ver_password_val
    ) {
      const signup_data = new FormData();
      signup_data.append("first_name", first_name_val);
      signup_data.append("last_name", last_name_val);
      signup_data.append("email", email_val);
      signup_data.append("password", password_val);
      // signup_data.append('role', chosen_role)

      fetch(pages.base_url + "signup.php", {
        method: "POST",
        body: signup_data,
        // redirect: 'follow',
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status == "signed up successfully") {
            window.location.href = "index.html";
          }
        })
        .catch((error) => console.log(error));
    }
  });
};
pages.myFetchSigninEmail = () => {
  const nextButton = document.getElementById("next");

  nextButton.addEventListener("click", function (e) {
    e.preventDefault();

    let email = document.getElementById("signin-email").value;

    if (email === "") {
      let warning = document.getElementById("signin-email");
      warning.style.backgroundColor = "lightcoral";
    }

    const data = new FormData();
    data.append("email", email);

    fetch(pages.base_url + "email.php", {
      method: "POST",
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        pages.handleResponse(data, email);
      })

      .catch((error) => console.log("Error In Email API: ", error));
  });
};

pages.myFetchSigninPassword = () => {
  const password_next_btn = document.getElementById("password-next");
  const showPasswordCheckbox = document.getElementById("showPassword");
  const password = document.getElementById("signin-password");

  showPasswordCheckbox.addEventListener("change", function () {
    if (showPasswordCheckbox.checked) {
      password.type = "text";
    } else {
      password.type = "password";
    }
  });

  password_next_btn.addEventListener("click", (e) => {
    e.preventDefault();
    const password = document.getElementById("signin-password");
    const password_val = password.value;

    const pass_data = new FormData();
    pass_data.append("email", localStorage.getItem("email"));
    pass_data.append("password", password_val);

    fetch(pages.base_url + "password.php", {
      method: "POST",
      body: pass_data,
    })
      .then((response) => response.json())
      .then((data) => {
        pages.handleResponse(data);
      })
      .catch((error) => console.log("Error In Email API: ", error));
  });
};
pages.handleResponse = (data, email = null) => {
  const response = data.status;
  switch (response) {
    case "this email does not exist" || "wrong password":
      break;
    case "email found":
      localStorage.setItem("email", email);
      let email_tab = document.querySelector(".signin-email");
      let password_tab = document.querySelector(".signin-password");

      email_tab.style.display = "none";
      password_tab.style.display = "flex";

      let email_text = document.getElementById("email");
      email_text.innerText = email;
      break;

    case "logged in":
      localStorage.setItem("first_name", data.first_name);
      localStorage.setItem("last_name", data.last_name);
      localStorage.setItem("user_id", data.user_id);
      window.location.href = "classroom.html"
      break;
    default:
      console.log("handleResponse Error");
  }
};

pages.openSidebar = () => {
  const open_sidebar = document.getElementById("sidebar-btn");
  const sidebar = document.getElementById("mySidebar");
  open_sidebar.onclick = () => {
    sidebar.classList.add("show");
  };
};

pages.closeSidebar = () => {
  const sidebar = document.getElementById("mySidebar");

  window.onclick = function (event) {
    if (event.target == sidebar) {
      sidebar.classList.remove("show");
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


pages.showClassesDashboard = () => {
  const user_id = localStorage.getItem('user_id');
  const show_classes_form_data = new FormData();
  show_classes_form_data.append('user_id', user_id);

  fetch(pages.base_url + 'classes.php', {
    method: "POST",
    body: show_classes_form_data,
  })
    .then((response) => response.json())
    .then((data) => {
      data.forEach(element => {
        const class_obj = new Class(
          element.class_id,
          element.class_name,
          element.class_section,
          element.class_subject,
          element.class_room,
          element.total_students_number,
          element.class_code,
          element.role
        );

        document.querySelector('.class-cards-container').innerHTML += class_obj.displayClassCard();

        if (element.role === 'teacher') {
          document.querySelector('.sidebar-teaching').innerHTML += class_obj.addSideBarItem(element.class_name, element.class_section, element.class_id);
        } else if (element.role === 'student') {
          document.querySelector('.sidebar-enrolled').innerHTML += class_obj.addSideBarItem(element.class_name, element.class_section, element.class_id);
        }
      });
    });
}

pages.resetPasswordEmail = () => {
  const forgot_password_btn = document.getElementById('forgot-password-btn')

  forgot_password_btn.addEventListener('click', e => {
    e.preventDefault()
    document.getElementById('email-sent-text').style.display = 'block'
    let email = localStorage.getItem('email');

    const data = new FormData();
    data.append("email", email);

    fetch(pages.base_url + "email.php", {
      method: "POST",
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == "email found"){
          const email = localStorage.getItem('email')
          const form_data = new FormData()
          form_data.append('email', email)
          fetch(pages.base_url + 'reset-password-email.php', {
            method: "POST",
            body: form_data,
          })
            .catch((error) => console.log("Error In Email API: ", error));
        }
      })

      .catch((error) => console.log("Error In Email API: ", error));
  })
}