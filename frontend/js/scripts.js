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
// pages.base_url = "http://localhost/GoogleClassroom/";

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
  const email = localStorage.getItem("email");


  const fullNameElement = document.getElementById("full-name-disp");
  const emailElement = document.getElementById("email-disp");

  fullNameElement.textContent = `${firstName} ${lastName}`;
  emailElement.textContent = `Email: ${email}`;
};

pages.editUserInfo = () => {
  const update_info_btn = document.getElementById('info-edit-done-btn')

  const new_first_name_input = document.getElementById('edit-first-name-input')
  const new_last_name_input = document.getElementById('edit-last-name-input')

  update_info_btn.addEventListener('click', () => {
    const new_first_name = new_first_name_input.value
    const new_last_name = new_last_name_input.value

    const old_first_name = localStorage.getItem('first_name')
    const old_last_name = localStorage.getItem('last_name')

    if ((old_first_name != new_first_name) || 
              (old_last_name != new_last_name)){
                const update_info_data = new FormData()
                update_info_data.append('new_first_name', new_first_name)
                update_info_data.append('new_last_name', new_last_name)
                update_info_data.append('user_id', localStorage.getItem('user_id'))
                const result_msg = document.getElementById('update-info-msg')
                fetch(pages.base_url + 'edit-user-information.php', {
                  method: "POST", 
                  body: update_info_data
                }).then(response => response.json())
                .then(data => {
                  if(data.status == 'info updated successfully'){
                    result_msg.innerText = 'Info updated successfully'
                    result_msg.style.display = 'block'
                    localStorage.setItem('first_name', new_first_name)
                    localStorage.setItem('last_name', new_last_name)
                    pages.displayUserInfo()
                  } else {
                    result_msg.innerText = 'An error occurred, try again'
                    result_msg.style.color = 'red'
                    result_msg.style.display = 'block'
                  }
                }).catch((error) => console.log("Error In edit-user-information Api: ", error))
                
    }
  })
}

pages.showClassesDashboard = () => {
  const user_id = localStorage.getItem('user_id');
  const show_classes_form_data = new FormData();
  show_classes_form_data.append('user_id', user_id);

  const classes_objects = [];
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

        classes_objects.push(class_obj);

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
            const clicked_class = classes_objects.find(item => item.class_id == classId);
            console.log(clicked_class);
          
            if (clicked_class.role === 'teacher') {
              pages.enterClassTeacher();
            }
            else if (clicked_class.role === 'student') {
              pages.enterClassStudent();
            }


          });
        });

      });
    })
}

pages.showOverlay = () => {
  document.getElementById('overlay').style.display = 'block'
  document.getElementById('class-options').style.display = 'none'

}
pages.showOverlay2 = () => {
  document.getElementById('overlay2').style.display = 'block'
  document.getElementById('class-options').style.display = 'none'
}

pages.showOverlay3 = () => {
  document.getElementById('overlay3').style.display = 'block'
  document.getElementById('user-info-tab').style.display = 'none'
  document.getElementById('edit-first-name-input').value = localStorage.getItem('first_name')
  document.getElementById('edit-last-name-input').value = localStorage.getItem('last_name')
}

pages.showBox = () => {
  const add_class_button = document.getElementById('add-class-button')
  const class_options = document.getElementById("class-options")
  add_class_button.addEventListener('click', () => {
    class_options.style.display = 'flex';
  })
}
  ;


pages.hideBox = () => {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("assignment-info-tab").style.display = "none";
  document.getElementById("overlay2").style.display = "none";
  document.getElementById("overlay3").style.display = "none";
  document.getElementById('add-class-button').classList.remove('plus-btn-options-shown');
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

// pages.enterClass =() => {
//     document.getElementById("class-cards-container").style.display = "none";
//     document.getElementById("middleSection").style.display = "block";
//     document.getElementById("goole-nav-icon").remove();
//     pages.showStream();
// }

pages.enterClassTeacher = () => {
  document.getElementById("class-cards-container").style.display = "none";
  document.getElementById("middleSection").style.display = "block";
  document.getElementById("goole-nav-icon").remove();
  document.getElementById("add-class-button").remove();
  document.getElementById("studentCount").remove();
  document.getElementById("class-meeting-link-box").remove();
  let title = document.getElementById("nav-title")
  title.innerText = "Teacher View"
  pages.showStream();
}

pages.enterClassStudent = () => {
  document.getElementById("class-cards-container").style.display = "none";
  document.getElementById("middleSection").style.display = "block";
  document.getElementById("goole-nav-icon").remove();
  document.getElementById("add-class-button").remove();
  document.getElementById("create-assignment").remove();
  document.getElementById("add-students-icon").remove();
  document.getElementById("class-meeting-code-box").remove()
  let title = document.getElementById("nav-title")
  title.innerText = "Student View"

  pages.showStream();
}


pages.showStream = () => {
  document.getElementById("inside-class-stream").style.display = "flex";
  document.getElementById("inside-class-people").style.display = "none";
  document.getElementById("inside-class-classwork").style.display = "none";
}

pages.showPeople = () => {
  document.getElementById("inside-class-stream").style.display = "none";
  document.getElementById("inside-class-people").style.display = "flex";
  document.getElementById("inside-class-classwork").style.display = "none";
}

pages.showClasswork = () => {
  document.getElementById("inside-class-stream").style.display = "none";
  document.getElementById("inside-class-people").style.display = "none";
  document.getElementById("inside-class-classwork").style.display = "flex";
}


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
};

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
        if (data.status == "email found") {
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


pages.resetPassword = () => {
  const reset_pass_btn = document.getElementById('reset-pass')
  reset_pass_btn.addEventListener('click', e => {
    e.preventDefault()
    const email = document.getElementById('email-to-reset-pass').value
    const new_pass = document.getElementById('new-pass-try1').value
    const new_pass_retry = document.getElementById('new-pass-try2').value
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('user_id');
    if (new_pass === new_pass_retry) {
      const reset_pass_data = new FormData()
      reset_pass_data.append('email', email)
      reset_pass_data.append('new_password', new_pass)
      reset_pass_data.append('token', token)
      fetch(pages.base_url + 'reset-password.php', {
        method: "POST",
        body: reset_pass_data,
      })
        .catch((error) => console.log("Error In Email API: ", error));
    }
  }
  )
}


pages.showAssignmentInfo = () => {
  document.getElementById("assignment-info-tab").style.display = "flex";
}


pages.createAssignment = () => {

  console.log('yes')
  pages.cancelBox()

}

pages.joinClassViaCode = () => {
  const entered_class_code = document.getElementById('class-code-input')
  const join_class_with_code_btn = document.getElementById('join-class-with-code-btn')
  join_class_with_code_btn.addEventListener('click', () => {

    join_class_data = new FormData()

    join_class_data.append('user_id', localStorage.getItem('user_id'))
    join_class_data.append('class_code', entered_class_code.value)

    fetch(pages.base_url + 'join-class.php', {
      method: "POST",
      body: join_class_data,
    }).then(response => response.json())
      .then(data => {
        if (data.status == 'class joined successfully') {
          location.reload()
        } else if (data.status == 'class code does not exist') {
          const invalid_join_code = document.getElementById('invalid-join-code')
          invalid_join_code.textContent = 'Invalid class code'
          invalid_join_code.style.display = 'block'
        }
        else if (data.status == 'user already enrolled in this class') {
          const invalid_join_code = document.getElementById('invalid-join-code')
          invalid_join_code.textContent = "You're already a member of this class"
          invalid_join_code.style.display = 'block'
        }
      }).catch((error) => console.log("Error In join-class Api: ", error));
  })

}

pages.sendInviteEmail = () => {
  const invite_sender_first_name = localStorage.getItem('first_name')
  const invite_sender_last_name = localStorage.getItem('last_name')
  const send_invite_to_input = document.getElementById('email-to-invite-input')
  const send_invite_btn = document.getElementById('invite-class-with-email-btn')
  const send_invite_email_error_msg = document.getElementById('send-invite-email-error')
  send_invite_btn.addEventListener('click' , () => {
    const send_invite_to_email = send_invite_to_input.value
    if (!send_invite_to_email){
      send_invite_email_error_msg.innerText = 'Please enter an email'
      send_invite_email_error_msg.style.display = 'block'
    } else {
      const send_invite_data = new FormData()
      send_invite_data.append('email', send_invite_to_email)
      // send_invite_data.append('class_id', Class.class_id)
      send_invite_data.append('class_id', 9)

      send_invite_data.append('sender_first_name', invite_sender_first_name)
      send_invite_data.append('sender_last_name', invite_sender_last_name)

      fetch(pages.base_url + 'send-invite-email.php', {
        method: "POST",
        body: send_invite_data
      }).then(response =>  response.json())
      .then(data => {
        if(data.status == 'Message has been sent'){
          send_invite_email_error_msg.style.display = 'none'
          send_invite_email_error_msg.innerText = 'Invite sent successfully'
          send_invite_email_error_msg.style.color = 'rgb(26, 232, 36)'
          send_invite_email_error_msg.style.display = 'block'
        } else {
          send_invite_email_error_msg.style.display = 'none'
          send_invite_email_error_msg.innerText = 'Something went wrong, please try again.'
          send_invite_email_error_msg.style.display = 'block'
        }
      }).catch((error) => error);
    }
  }) 

}