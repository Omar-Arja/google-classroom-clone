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
      <div class="class class-card" data-class-id="${this.class_id}">
        <div class="class-card-background-image">
          <div class="class-title-section">
            <a href="#" class="class-title">${this.class_name}</a>
            <a href="#" class="class-section">${this.class_section}</a>
          </div>
        </div>
      </div>
    `;
  }

  displayStreamCard(senderName, assignmentTitle, assignmentDetails) {
    return `
      <div class="notifications">
        <img class="userIcon" src="../assets/Images/default-profile-icon.jpg" alt="Default icon" />
        <div>
          <h5>${senderName}</h5>
          <p>${assignmentTitle}: ${assignmentDetails}</p>
        </div>
      </div>
    `;
  }


  addSideBarItem() {
    return `
      <div class="class sidebar-class" data-class-id="${this.class_id}">
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
  }
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

    case "class created successfully":
      pages.hideBox()
      window.location.href = "classroom.html"
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

  userIcon.addEventListener('click', function () {
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
          document.querySelector('.sidebar-teaching').innerHTML += class_obj.addSideBarItem();
        } else if (element.role === 'student') {
          document.querySelector('.sidebar-enrolled').innerHTML += class_obj.addSideBarItem();
        }
        // Add event listener to the classes
        const classes = document.querySelectorAll('.class');
        classes.forEach(item => {
          item.addEventListener('click', (event) => {
            const classId = event.currentTarget.dataset.classId;
            console.log('Class ID clicked:', classId);
          });
        });

      });
    })
}

pages.showBox = () => {
  document.getElementById("overlay").style.display = "block";
};

pages.hideBox = () => {
  document.getElementById("overlay").style.display = "none";
};

pages.cancelBox = () => {
  pages.hideBox();
};

pages.createClass = () => {
  const classname = document.getElementById("input-classname").value;
  const section = document.getElementById("input-section").value;
  const subject = document.getElementById("input-subject").value;
  const room = document.getElementById("input-room").value;
  console.log(classname, section, subject, room);

  // localStorage.setItem("user_id", data.user_id);

  const pass_data = new FormData();
  pass_data.append("user_id", localStorage.getItem("user_id"));
  pass_data.append("class_name", classname);
  pass_data.append("class_section", section);
  pass_data.append("class_subject", subject);
  pass_data.append("class_room", room);

  fetch(pages.base_url + "create-class.php", {
    method: "POST",
    body: pass_data,
  })
    .then((response) => response.json())
    .then((data) => {
      pages.handleResponse(data);
    })
    .catch((error) => console.log("Error In  Create Class: ", error));

};

pages.enterClass = () => {
  document.getElementById("class-cards-container").style.display = "none";
  document.getElementById("middleSection").style.display = "block";
  document.getElementById("goole-nav-icon").remove();
  document.getElementById("add-class-button").remove();
  pages.showStream();
}


pages.showStream = () => {
  document.getElementById("inside-class-stream").style.display = "flex";
  document.getElementById("inside-class-people").style.display = "none";
}

pages.showPeople = () => {
  document.getElementById("inside-class-stream").style.display = "none";
  document.getElementById("inside-class-people").style.display = "flex";
}


// pages.addStudent('kahled','student')

pages.addStudent = (name, role) => {
  const student_list = document.querySelector(".student-list");
  const teacher_list = document.querySelector(".teacher-list");
  const li = document.createElement("li");
  const div = document.createElement("div");
  div.classList.add("person");

  const img = document.createElement("img");
  img.src = "../assets/Images/default-profile-icon.jpg";
  img.classList.add("userIcon");

  const span = document.createElement("span");
  span.classList.add("person-name");
  span.textContent = name;

  div.appendChild(img);
  div.appendChild(span);
  li.appendChild(div);
  if (role == 'teacher') {
    teacher_list.appendChild(li);
  }
  else {
    student_list.appendChild(li);
  }


  pages.updateStudentCount();
};

pages.updateStudentCount = () => {
  const student_list = document.querySelector(".student-list");
  const student_count = document.getElementById("studentCount");
  const count = student_list.children.length;
  student_count.textContent = `${count} students`;
}

pages.resetPasswordEmail = () => {
  const forgot_password_btn = document.getElementById('forgot-password-btn')

  forgot_password_btn.addEventListener('click', e => {
    e.preventDefault()
    
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
          }).then(document.getElementById('email-sent-text').style.display = 'block')
            .catch((error) => console.log("Error In Email API: ", error));
        }
      })

      .catch((error) => console.log("Error In Email API: ", error));
  })
}


pages.resetPassword = () =>{
  const reset_pass_btn = document.getElementById('reset-pass')
  reset_pass_btn.addEventListener('click', e =>{
    e.preventDefault()
    const email = document.getElementById('email-to-reset-pass').value
    const new_pass = document.getElementById('new-pass-try1').value
    const new_pass_retry = document.getElementById('new-pass-try2').value
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('user_id');
    if (new_pass === new_pass_retry){
      const reset_pass_data = new FormData()
      reset_pass_data.append('email', email)
      reset_pass_data.append('new_password', new_pass)
      reset_pass_data.append('token', token)
      fetch(pages.base_url + 'reset-password.php', {
        method: "POST",
        body: reset_pass_data,
      })
        .catch((error) => console.log("Error In Email API: ", error));
    }}
  )
}
  