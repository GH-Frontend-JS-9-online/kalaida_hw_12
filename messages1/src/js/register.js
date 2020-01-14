let emailRegister = document.querySelector('#regEmail'),
  passwordRegister = document.querySelector('#regPassword'),
  passwordConfirmRegister = document.querySelector('#regConfirmPassword'),
  registerBtn = document.querySelector('#signup'),
  registerError = document.querySelector('#regError'),
  registerBlocker = document.querySelector('#signupInputBlocker'),
  registerEmail, registerPassword, registerPasswordConfirm, registerName, registerPhone, registerJob, encryptedPass, userId,
  // encryptSymbols = ['$2b$10$', 'EasPYqj', 'UNq.Grv', 'jYBnHaK', 'Aq6iW9a', '_jg7bH1', '#bcxGY7', '$#$_gdf', '$3v$90$', '$410g$2', 'Dw9P3O2', '.4.gd.6'],
  encryptSymbols = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890_#$/',
  idSymbols = 'abcdefghijklmnopqrstuvwxyz1234567890',
  encryptString = '',
  userPosts = ['UX/UI Designer', 'Java Developer', 'JavaScript Developer', 'Ruby Developer', 'QA', 'Backend Developer', 'Frontend Developer', 'Full-stack Developer', 'Manager', 'Investor Platinum', 'Investor Gold', 'Investor Silver', 'GeekHub Student'],
  emailTestString =  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  testLetters = /[a-zA-Z]/,
  testNumber = /[0-9]/,
  usersArr = [],
  dbUsers,
  secondDbUsers;

  function sendRequest(method, url, myName, myEmail, myPass, myPhone, myJob, myId) {
    return fetch(url, {
      method : method,
      headers: {
        'Content-Type': 'application/json'
      },
      body : JSON.stringify({
        name: myName,
        password: myPass,
        email: myEmail,
        position: myJob,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        phone: myPhone,
        address: '65 Lorem St, Warshaw, PL',
        organization: 'GeekHub Corp',
        id: myId
      }),
    })
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

if(emailRegister) {
  emailRegister.addEventListener('input', function (event) {
    registerEmail = event.target.value;
    if(!emailTestString.test(registerEmail)) {
      if(registerBlocker.classList.contains('signup-inputBlockerNo')) {
        registerBlocker.classList.remove('signup-inputBlockerNo');
      }
      registerError.innerHTML = 'Oops, looks like email or password is incorrect. Please try again.';
    } else {
      if(!registerBlocker.classList.contains('signup-inputBlockerNo') && ((registerPassword.length > 4 && registerPassword.length < 16) || testLetters.test(registerPassword) || testNumber.test(registerPassword)) && registerPasswordConfirm === registerPassword) {
        registerBlocker.classList.add('signup-inputBlockerNo');
      }
      registerError.innerHTML = '';
    }
  });
}

if(passwordRegister) {
  passwordRegister.addEventListener('input', function (event) {
    registerPassword = event.target.value;
    if(registerPassword.length < 4 || !testLetters.test(registerPassword) || !testNumber.test(registerPassword) || !emailTestString.test(registerEmail) || registerPassword.length > 16) {
      if(registerBlocker.classList.contains('signup-inputBlockerNo')) {
        registerBlocker.classList.remove('signup-inputBlockerNo');
      }
      registerError.innerHTML = 'Oops, looks like email or password is incorrect. Please try again.';
    } else {
      if(!registerBlocker.classList.contains('signup-inputBlockerNo') && emailTestString.test(registerEmail) && registerPasswordConfirm === registerPassword) {
        registerBlocker.classList.add('signup-inputBlockerNo');
      }
      registerError.innerHTML = '';
    }
  });
}

if(passwordConfirmRegister) {
  passwordConfirmRegister.addEventListener('input', function (event) {
    registerPasswordConfirm = event.target.value;
    if(registerPasswordConfirm !== registerPassword) {
      if(registerBlocker.classList.contains('signup-inputBlockerNo')) {
        registerBlocker.classList.remove('signup-inputBlockerNo');
      }
      registerError.innerHTML = 'Please confirm your password!';
    } else {
      if(!registerBlocker.classList.contains('signup-inputBlockerNo') && emailTestString.test(registerEmail)) {
        registerBlocker.classList.add('signup-inputBlockerNo');
      }
      registerError.innerHTML = '';
    }
  });
}

if(registerBtn) {
  registerBtn.addEventListener('click', function(event) {
    event.preventDefault();
    const registerId = `f${(~~(Math.random()*1e8)).toString(16)}`;
    registerName = '';
    registerPhone = '+48 ';
    encryptedPass = '';
    encryptString = '';
    userId = '';
    registerJob = userPosts[Math.floor(Math.random() * userPosts.length)];
    for(let i = 0; i < registerEmail.length; i++) {
      if(registerEmail[i] !== '@') {
        registerName += registerEmail[i];
      } else {
        i = registerEmail.length - 1
      }
    }
    for(let i = 0; i < 9; i++) {
      registerPhone += Math.floor((Math.random() * 9));
    }
    for(let i = 0; i < registerPassword.length; i++) {
      encryptedPass += registerPassword[i];
      for(let j = 0; j < 7; j++) {
        encryptString += encryptSymbols[Math.floor(Math.random() * encryptSymbols.length)];
      }
      encryptedPass += encryptString;
      encryptString = '';
    }
    for(let i = 0; i < 16; i++) {
      userId += idSymbols[Math.floor(Math.random() * idSymbols.length)];
    }
    sendRequest('POST','http://localhost:3000/users', registerName, registerEmail, encryptedPass, registerPhone, registerJob, userId)
      .then(() => {
        alert('You\'ve successfully registered!');
        location.reload();
      })
      .catch(error => console.log(error))
  });
}