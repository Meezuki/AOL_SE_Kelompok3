const form = document.getElementById('form')
const username = document.getElementById('username')
const password = document.getElementById('password')
const email = document.getElementById('email')
const conPassword = document.getElementById('conPassword')
const dob = document.getElementById('dob')
const male = document.getElementById('male')
const female = document.getElementById('female')
const agreement = document.getElementById('agreement')

function validateRegister(event){
    event.preventDefault();
    let valid = true;

    if (username.value.length < 5){
        valid = false;
        alert('Username length must be more than 4')
    }
    else if(!email.value.endsWith('@gmail.com')){
        valid = false;
        alert('Email is not valid, only gmail')
    }
    else if(!isAlphaNum(password.value)){
        valid = false;
        alert('Password must contains both number and letter')
    }
    else if((password.value != conPassword.value)){
        valid = false;
        alert('password is wrong')
    }
    else if(!dob.value){
        valid = false;
        alert('birthdate must be selected')
    }
    else if(!male.checked && !female.checked){
        valid = false;
        alert('you must understand whether you are binusian or not!')
    }
    else if(!agreement.checked){
        valid = false;
        alert('agreement must be checked')
    }

    if(valid){
        document.getElementById("myButton").onclick = function () {
            location.href = "homepage.html";
        };
    }
}

function isAlphaNum(password){
    let Alpha = false;
    let Number = false;

    for(let i=0; i<password.length; i++){
        if(isNaN(password[i])){
            Alpha = true;
        }
        else{
            Number = true;
        }
    }

    return Alpha && Number;
}

form.addEventListener('submit',validateRegister)