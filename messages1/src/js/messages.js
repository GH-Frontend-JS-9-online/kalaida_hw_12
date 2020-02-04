(function () {
  let dbUsers, userId, messageText,
    months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    idSymbols = 'abcdefghijklmnopqrstuvwxyz1234567890',
    wordsTemplates = ['Hello! How r u doing?', 'Hi! How was your day?', 'What\'s up bro!', 'Yo man!!'];

  if(!sessionStorage.getItem('login_user_id') || sessionStorage.getItem('login_user_id').length < 1) {
    document.querySelector('.mainMessages').style.display = 'none';
    document.querySelector('#needLogin').style.display = 'flex';
  } else {
    userId = sessionStorage.getItem('login_user_id');
    console.log(`User id: ${userId}`);
    document.querySelector('.mainMessages').style.display = 'flex';
    document.querySelector('#needLogin').style.display = 'none';
  }

  function sendRequestGet(url) {
    return fetch(url)
      .then(response => {
        if(response.ok) {
          return response.json();
        }
        return response.json()
          .then(error => {
            const err = new Error('Something went wrong');
            err.data = error;
            return err;
          })
      })
  }

  function sendRequestPost(url, myId, myUserId, myThread, myBody, myDateCreate) {
    return fetch(url, {
      method : 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body : JSON.stringify({
        id : myId,
        user : myUserId,
        thread : myThread,
        body : myBody,
        created_at : myDateCreate
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

  document.querySelector('#newConversationBtn').addEventListener('click', function () {
    let myDate = new Date();
    document.querySelector('.messaging_content_left').innerHTML = '';
    document.querySelector('.messaging_content_right').innerHTML = '';

    setTimeout(function () {

      document.querySelector('.messaging_content_left').insertAdjacentHTML('afterBegin', `
    <div class="messaging_content_left_comment">
      <div class="messaging_content_left-avatar"></div>
      <div class="messaging_content_left_content">
        <p class="messaging_content_left-message">${wordsTemplates[Math.floor(Math.random() * wordsTemplates.length)]}</p>
        <p class="messaging_content_left-date">${myDate.getDate() + ' ' + months[myDate.getMonth()] + ' ' + myDate.getFullYear() + ', ' + myDate.getHours() + ':' + myDate.getMinutes()}</p>
      </div>
    </div>
    `);

    }, 1000)

    sendRequestGet('http://localhost:3000/users')
      .then(data => {
        let userInformationIndex = -1,
          friendId = userId;
        dbUsers = data;

        while(friendId === userId) {
          userInformationIndex = Math.floor(Math.random() * dbUsers.length);
          friendId = dbUsers[userInformationIndex].id;
        }

        if(userInformationIndex !== -1) {
          sessionStorage.setItem('friend_id', '');
          sessionStorage.setItem('friend_id', friendId);
          document.querySelector('.aside').innerHTML = '';

          document.querySelector('.aside').insertAdjacentHTML('afterBegin', `
          <div id="asideUserAvatar"></div>
          <p id="asideUserName">${dbUsers[userInformationIndex].name}</p>
          <p id="asideUserPost">${dbUsers[userInformationIndex].position}</p>
          <p id="asideUserDescription">${dbUsers[userInformationIndex].description}</p>
          <p class="aside-userList">Email</p>
          <p id="asideUserEmail">${dbUsers[userInformationIndex].email}</p>
          <p class="aside-userList">Phone</p>
          <div id="asideUserPhone">${dbUsers[userInformationIndex].phone}</div>
          <p class="aside-userList">Address</p>
          <p id="asideUserAddress">${dbUsers[userInformationIndex].address}</p>
          <p class="aside-userList">Organization</p>
          <p id="asideUserOrganization">${dbUsers[userInformationIndex].organization}</p>
          `);

          document.querySelector('.messaging-inputBlocker').style.display = 'none';
        }
      })
      .catch(error => console.log(error));
  });


  document.querySelector('#messageInput').addEventListener('input', function (event) {
    event.preventDefault();
    messageText = event.target.value;
  });

  document.querySelector('#messageInput').addEventListener('keydown', function (event) {
    if(13 === event.keyCode) {

      event.preventDefault();

      let myDate = new Date(),
        messageId = '',
        friendMessageId = '',
        userId = sessionStorage.getItem('login_user_id'),
        messageThread = '';

      console.log(messageText);

      document.querySelector('.messaging_content_right').insertAdjacentHTML('beforeEnd', `
      <div class="messaging_content_right_comment">
        <div class="messaging_content_right_content">
          <p class="messaging_content_right-message">${messageText}</p>
          <p class="messaging_content_right-date">${myDate.getDate() + ' ' + months[myDate.getMonth()] + ' ' + myDate.getFullYear() + ', ' + myDate.getHours() + ':' + myDate.getMinutes()}</p>
        </div>
        <div class="messaging_content_right-avatar"></div>
      </div>
      `);

      for(let i = 0; i < 18; i++) {
        messageId += idSymbols[Math.floor(Math.random() * idSymbols.length)];
      }

      for(let i = 0; i < 22; i++) {
        messageThread += idSymbols[Math.floor(Math.random() * idSymbols.length)];
      }

      sendRequestPost('http://localhost:3000/messages', messageId, userId, messageThread, messageText, new Date())
        .then(data => console.log(data))
        .catch(error => console.log(error));

      let friendSays = prompt('Your friend says: (0.01 - 3 seconds)'),
        friendSaysTime = Math.floor(Math.random() * 3001);

      for(let i = 0; i < 18; i++) {
        friendMessageId += idSymbols[Math.floor(Math.random() * idSymbols.length)];
      }

      setTimeout(function () {
        sendRequestPost('http://localhost:3000/messages', friendMessageId, sessionStorage.getItem('friend_id'), messageThread, friendSays, new Date())
          .then(data => console.log(data))
          .catch(error => console.log(error));
        document.querySelector('.messaging_content_left').insertAdjacentHTML('beforeEnd', `
        <div class="messaging_content_left_comment">
          <div class="messaging_content_left-avatar"></div>
          <div class="messaging_content_left_content">
            <p class="messaging_content_left-message">${friendSays.length > 0 ? friendSays : '...'}</p>
            <p class="messaging_content_left-date">${myDate.getDate() + ' ' + months[myDate.getMonth()] + ' ' + myDate.getFullYear() + ', ' + myDate.getHours() + ':' + myDate.getMinutes()}</p>
          </div>
        </div>
        `);
      }, friendSaysTime);



      document.querySelector('#messageInput').value = '';
    }
  })

})();