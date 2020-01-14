(function () {
  let emailLogin = document.querySelector('#email'),
    passwordLogin = document.querySelector('#password'),
    loginBtn = document.querySelector('#login'),
    loginMessage = document.querySelector('#loginAlert'),
    loginError = document.querySelector('#loginError'),
    loginBlocker = document.querySelector('#loginInputBlocker'),
    loginEmail, loginPassword, decryptedPass,
    emailTestString =  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    testLetters = /[a-zA-Z]/,
    testNumber = /[0-9]/,
    dbUsers;

  function sendRequest(method, url, body = null) {
    return fetch(url)
      .then(response => {
        if(response.ok) {
          return response.json();
        }
        return response.json().then(error => {
          const err = new Error('Something went wrong');
          err.data = error;
          throw err;
        })
      });
  }

  if(emailLogin) {
    emailLogin.addEventListener('input', function (event) {
      loginEmail = event.target.value;
      if(!emailTestString.test(loginEmail)) {
        if(loginBlocker.classList.contains('login-inputBlockerNo')) {
          loginBlocker.classList.remove('login-inputBlockerNo');
        }
        loginError.innerHTML = 'Oops, looks like email or password is incorrect. Please try again.';
      } else {
        if(!loginBlocker.classList.contains('login-inputBlockerNo') && ((loginPassword.length > 4 && loginPassword.length < 16) || testLetters.test(loginPassword) || testNumber.test(loginPassword))) {
          loginBlocker.classList.add('login-inputBlockerNo');
        }
        loginError.innerHTML = '';
      }
    });
  }

  if(passwordLogin) {
    passwordLogin.addEventListener('input', function (event) {
      loginPassword = event.target.value;
      if(loginPassword.length < 4 || !testLetters.test(loginPassword) || !testNumber.test(loginPassword) || !emailTestString.test(loginEmail) || loginPassword.length > 16) {
        if(loginBlocker.classList.contains('login-inputBlockerNo')) {
          loginBlocker.classList.remove('login-inputBlockerNo');
        }
        loginError.innerHTML = 'Oops, looks like email or password is incorrect. Please try again.';
      } else {
        if(!loginBlocker.classList.contains('login-inputBlockerNo') && emailTestString.test(loginEmail)) {
          loginBlocker.classList.add('login-inputBlockerNo');
        }
        loginError.innerHTML = '';
      }
    });
  }

  if(loginBtn) {
    loginBtn.addEventListener('click', function (event) {
      event.preventDefault();
      sendRequest('GET', 'http://localhost:3000/users')
        .then(data => {
          let checkUserNumber = -1,
          checkEmailNumber = 0;
          dbUsers = data;
          decryptedPass = '';
          for(let i = 0; i < dbUsers.length; i++) {
            if(loginEmail === dbUsers[i].email) {
              checkEmailNumber = i;
              i = dbUsers.length - 1;
            }
          }
          if(checkEmailNumber !== -1) {
            for(let i = 0; i < dbUsers[checkEmailNumber].password.length; i++) {
              decryptedPass += dbUsers[checkEmailNumber].password[i];
              i += 7;
            }
            if(loginPassword === decryptedPass) {
              checkUserNumber = 1;
            } else {
              checkUserNumber = 0;
            }
          }
          // for(let i = 0; i < dbUsers.length; i++) {
          //   if(loginEmail === dbUsers[i].email && loginPassword === dbUsers[i].password) {
          //     checkUserNumber = 1;
          //   }
          // }
          if(checkUserNumber === 1) {
            loginMessage.classList.add('header-loginTextLogin');
            emailLogin.value = '';
            passwordLogin.value = '';
            sessionStorage.setItem('login_user_id', '');
            sessionStorage.setItem('login_user_id', dbUsers[checkEmailNumber].id)
          } else {
            alert('Account was not found');
            location.reload();
          }
        })
        .catch(err => console.log(err));
    });
  }

})();

