(function () {
  let resetEmailInput = document.querySelector('#resetEmail'),
    resetBtn1 = document.querySelector('#reset1'),
    checkEmailBtn = document.querySelector('#checkEmailBtn'),
    reset2Pass = document.querySelector('#reset2Pass'),
    reset2ConfirmPass = document.querySelector('#reset2ConfirmPass'),
    reset1InputBlocker = document.querySelector('#reset1InputBlocker'),
    reset2InputBlocker = document.querySelector('#reset2InputBlocker'),
    reset1Error = document.querySelector('#reset1Error'),
    reset2Error = document.querySelector('#reset2Error'),
    resetForm = document.querySelector('#resetForm'),
    resetMainMessage = document.querySelector('#resetMainMessage'),
    reset2Btn = document.querySelector('#change'),
    decryptedPass,
    resetEmail,
    emailTestString = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    testLetters = /[a-zA-Z]/,
    testNumber = /[0-9]/,
    dbEmails, resetEmailId, reset2Password, reset2ConfirmPassword;

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


  if(resetEmailInput) {
    resetEmailInput.addEventListener('input', function (event) {
      resetEmail = event.target.value;
      if(!emailTestString.test(resetEmail)) {
        if(reset1InputBlocker.classList.contains('reset1-inputBlockerNo')) {
          reset1InputBlocker.classList.remove('reset1-inputBlockerNo');
        }
        reset1Error.innerHTML = 'Email is incorrect!';
      } else {
        if(!reset1InputBlocker.classList.contains('reset1-inputBlockerNo')) {
          reset1InputBlocker.classList.add('reset1-inputBlockerNo');
        }
        reset1Error.innerHTML = '';
      }
    });
  }

  if(resetBtn1) {
    resetBtn1.addEventListener('click', function (event) {
      event.preventDefault();

      sendRequest('GET', 'http://localhost:3000/users')
        .then(data => {
          let resetNumber;
          dbEmails = data;
          for(let i = 0; i < dbEmails.length; i++) {
            if(resetEmail === dbEmails[i].email) {
              resetNumber = 1;
              resetEmailId = i;
              i = dbEmails.length - 1;
            } else {
              resetNumber = 0
            }
          }
          if(resetNumber === 1) {
            resetForm.style.display = 'none';
            resetMainMessage.style.display = 'block';
          } else {
            alert('Account was not found!');
            location.reload();
          }
        })
        .catch(error => console.log(error))

      // dbEmails = JSON.parse(localStorage.getItem('users'));
      // for(let i = 0; i < dbEmails.length; i++) {
      //   if(resetEmail === dbEmails[i].email) {
      //     resetNumber = 1;
      //     resetEmailId = i;
      //     i = dbEmails.length - 1;
      //   } else {
      //     resetNumber = 0
      //   }
      // }
      // if(resetNumber === 1) {
      //   resetForm.style.display = 'none';
      //   resetMainMessage.style.display = 'block';
      // } else {
      //   alert('Account was not found!');
      //   location.reload();
      // }
    });
  }



  if(checkEmailBtn) {
    checkEmailBtn.addEventListener('click', function (event) {
      document.querySelector('#reset2MainRightText').style.display = 'inline-block';
      document.querySelector('#reset1Link').style.display = 'none';
      resetMainMessage.style.display = 'none';
      document.querySelector('#resetMain2Form').style.display = 'block';
    });
  }

  if(reset2Pass) {
    reset2Pass.addEventListener('input', function (event) {
      reset2Password = event.target.value;
      sendRequest('GET', 'http://localhost:3000/users')
        .then(data => {
          dbEmails = data;
          for(let i = 0; i < dbEmails.length; i++) {
            if(resetEmail === dbEmails[i].email) {
              resetEmailId = i;
              i = dbEmails.length - 1;
            }
          }
          if(reset2Password === dbEmails[resetEmailId].password || (reset2Password.length < 4 || !testLetters.test(reset2Password) || !testNumber.test(reset2Password) || reset2Password.length > 16)) {
            if(reset2InputBlocker.classList.contains('reset2-inputBlockerNo')) {
              reset2InputBlocker.classList.remove('reset2-inputBlockerNo');
            }
            reset2Error.innerHTML = 'Password is incorrect!';
          } else {
            if(!reset2InputBlocker.classList.contains('reset2-inputBlockerNo') && reset2ConfirmPassword === reset2Password && reset2Password !== dbEmails[resetEmailId].password) {
              reset2InputBlocker.classList.add('reset2-inputBlockerNo');
            }
            reset2Error.innerHTML = '';
          }
        })
        .catch(error => console.log(error))
    });
  }

  if(reset2ConfirmPass) {
    reset2ConfirmPass.addEventListener('input', function (event) {
      reset2ConfirmPassword = event.target.value;
      sendRequest('GET', 'http://localhost:3000/users')
        .then(data => {
          dbEmails = data;
          for(let i = 0; i < dbEmails.length; i++) {
            if(resetEmail === dbEmails[i].email) {
              resetEmailId = i;
              i = dbEmails.length - 1;
            }
          }
          if(reset2ConfirmPassword !== reset2Password || reset2Password === dbEmails[resetEmailId].password) {
            if(reset2InputBlocker.classList.contains('reset2-inputBlockerNo')) {
              reset2InputBlocker.classList.remove('reset2-inputBlockerNo');
            }
            reset2Error.innerHTML = 'Password is incorrect!';
          } else {
            if(!reset2InputBlocker.classList.contains('reset2-inputBlockerNo') && (reset2Password !== dbEmails[resetEmailId].password || ((reset2Password.length > 4 && reset2Password.length < 16) || testLetters.test(reset2Password) || testNumber.test(reset2Password)))) {
              reset2InputBlocker.classList.add('reset2-inputBlockerNo');
            }
            reset2Error.innerHTML = '';
          }
        })
        .catch(error => console.log(error))
    });
  }
  
  if(reset2Btn) {
    reset2Btn.addEventListener('click', function (event) {
      sendRequest('GET', 'http://localhost:3000/users')
        .then(data => {
          let emailId = -1,
            userNum = 0;
          dbEmails = data;
          decryptedPass = '';
          for(let i = 0; i < dbEmails.length; i++) {
            if(resetEmail === dbEmails[i].email) {
              emailId = dbEmails[i].id;
              userNum = i;
              i = dbEmails.length - 1;
            }
          }
          if(emailId !== -1) {
            console.log(emailId);
            for(let i = 0; i < dbEmails[userNum].password.length; i++) {
              decryptedPass += dbEmails[userNum].password[i];
              i += 7;
            }
            alert('Password was changed!(It doesn\'t work! I am sorry but I dont know how to do this((( )');
            alert(`Your password: ${decryptedPass}`);
            location.reload();
          } else {
            alert('Account was not found');
            location.reload();
          }
        })
        .catch(error => console.log(error))
    })
  }
})();