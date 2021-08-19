'use strict';

window.onload = function() {
    const togglePassword = document.querySelector('#togglePassword');
    const password = document.querySelector('#password');

    togglePassword.addEventListener('click', function(e) {
        // toggle the type attribute
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        // toggle the eye slash icon
        this.classList.toggle('fa-eye-slash');
    });
}

function validateForm(form) {
    var firstName = form.firstName.value;
    var lastName = form.lastName.value;
    var email = form.email.value;
    var password = form.password.value;
    var phone = form.phone.value;
    var regName = /^[a-zA-Z-'. ]+$/;
    var regexEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    var regexPass = /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9]{7,}$/;
    var regexPhone = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/;
    if (firstName.length == 0 || !regName.test(firstName)) {
        alert("please, enter valid firstName");
        form.firstName.focus();
        return false;
    }
    if (lastName.length == 0 || !regName.test(lastName)) {
        alert("please, enter valid lastName");
        form.lastName.focus();
        return false;
    }
    if ((form.sex[0].checked == false) && (form.sex[1].checked == false)) {
        alert("please,choose your gender");
        return false;
    }
    if (email.length == 0 || !regexEmail.test(email)) {
        alert("please, enter valid email");
        form.email.focus();
        return false;
    }
    if (password.length == 0 || !regexPass.test(password)) {
        alert("please, enter valid password");
        form.email.focus();
        return false;
    }
    if (phone.length == 0 || phone.length < 10 || !regexPhone.test(phone)) {
        alert("please, enter valid phone number");
        form.phone.focus();
        return false;
    }
    return true;
}