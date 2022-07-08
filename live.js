var backTop = document.getElementsByClassName('go_top_btn')[0];
var isExpandedNavbar = false;
var navbar_links = document.getElementsByClassName('nav-bar-link');
var icon = document.getElementById("toggler_img");
var links = document.querySelector('.links');
var mainpage = document.querySelectorAll(".main_page");
var name_status, email_status, subj_status, msg_status;

window.onscroll = function () {
  if (document.documentElement.scrollTop > 400) {
    backTop.style.visibility = "visible";
    backTop.style.opacity = "1";
  } else {
    backTop.style.visibility = "hidden";
    backTop.style.opacity = "0";
  }

  if (isExpandedNavbar){
    mobile_navbar();
  }
};

function navbar_default(){
  for (let i=0; i < navbar_links.length; i++){
    navbar_links[i].className = "nav-bar-link";
  }
}

function navbar_click(elem){
  navbar_default();
  elem.className += " active";

  if(isExpandedNavbar){
    mobile_navbar();
  }
}

function mobile_navbar(){
  let controls = document.querySelector(".controls");

  controls.classList.toggle("open");
  links.classList.toggle("open");

  if(isExpandedNavbar){
      hide_navbar();
  }
  else{
      show_navbar();
  }
}

function hide_navbar(){
  isExpandedNavbar = false;
  icon.src = "img/hamburger.svg";
}

function show_navbar(){
  isExpandedNavbar = true;
  icon.src = "img/cross.svg";
}

for (let i = 0; i<mainpage.length; i++){
  mainpage[i].addEventListener("click", () => {
    if (isExpandedNavbar){
      mobile_navbar();
    }
  });
}

function send_email(){
  console.log("send_email()");

  if (name_status && email_status && subj_status && msg_status){
    var link = "mailto:dchiruk@gmail.com"
             + "?subject=" + escape(document.getElementById('Subject').value)
             + "&body=" + escape("Hi, I`m " + document.getElementById('Name').value
             + ". \nThis is the message from your website.\n\n"
             + document.getElementById('Message').value + "\n\n");
    window.location.href = link;
    reset_mail_fields();
  }
  else {
      check_name();
      check_email();
      check_subject();
      check_message();
  }
  /*
  console.log("name_status = " + name_status);
  console.log("email_status = " + email_status);
  console.log("subj_status = " + subj_status);
  console.log("msg_status = " + msg_status);
  */
}

function reset_mail_fields(){
  document.getElementById('Name').value = "";
  document.getElementById('Email').value = "";
  document.getElementById('Subject').value = "";
  document.getElementById('Message').value = "";

  name_status = undefined;
  email_status = undefined;
  subj_status = undefined;
  msg_status = undefined;
}

function contains_special_chars(str) {
  const special_chars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  return special_chars.test(str);
}

function contains_digits(str){
  const digits = /\d/;
  return digits.test(str);
}

function check_name() {
  //console.log("check_name()");
  let name = document.getElementById('Name');

  if(name.value.length == 0){
    name_status = false;
  } else if (contains_special_chars(name.value) || contains_digits(name.value)){
    alert("Use only letters in your name!");
    name_status = false;
  } else  if (name.value[0] != name.value[0].toUpperCase()){
    alert("Respect yourself, type Your name starting with a capital letter!");
    name_status = false;
  } else  if (name.value.split(" ").length > 2){
    alert("Your first and last name would be enough)");
    name_status = false;
  } else {
    name_status = true;
  }

  if (name_status == false){
    name.className = "form wronginput";
  } else {
    name.className = "form";
  }
}

function check_email(){
  //console.log("check_email()");
  let email = document.getElementById('Email');
  let email_template = /^[a-zA-Z0-9.]+@+[a-zA-Z\d]+(.com)$/;

  if(email.value.length == 0){
    email_status = false;
  } else if (email.value[0] != '.' && email.value.match(email_template)){
    email_status = true;
  } else {
    alert("Email is not valid, try another one!");
    email_status = false;
  }

  if (!email_status){
    email.className = "form wronginput";
  } else {
    email.className = "form";
  }
}

function check_subject(){
  //console.log("check_subject()");
  let subj = document.getElementById('Subject');
  subj_status = (subj.value.length != 0);

  if (!subj_status){
    subj.className = "form wronginput";
  } else {
    subj.className = "form";
  }
}

function check_message(){
  //console.log("check_message()");
  let msg = document.getElementById('Message');
  msg_status = (msg.value.length != 0);

  if (!msg_status){
    msg.className = "form wronginput";
  } else {
    msg.className = "form";
  }
}
