(function () {
  let asideUserName = document.querySelector('#asideUserName'),
    asideUserPost = document.querySelector('#asideUserPost'),
    asideUserDescription = document.querySelector('#asideUserDescription'),
    asideUserEmail = document.querySelector('#asideUserEmail'),
    asideUserPhone = document.querySelector('#asideUserPhone'),
    asideUserAddress = document.querySelector('#asideUserAddress'),
    asideUserOrganization = document.querySelector('#asideUserOrganization'),
    dbUsers, userId;
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

  sendRequestGet('http://localhost:3000/users')
    .then(data => {
      let userInformationIndex = -1;
      dbUsers = data;
      for(let i = 0; i < dbUsers.length; i++) {
        if(userId === dbUsers[i].id) {
          userInformationIndex = i;
          i = dbUsers.length - 1;
        }
      }
      if(userInformationIndex !== -1) {
        asideUserName.innerHTML = dbUsers[userInformationIndex].name;
        asideUserPost.innerHTML = dbUsers[userInformationIndex].position;
        asideUserDescription.innerHTML = dbUsers[userInformationIndex].description;
        asideUserEmail.innerHTML = dbUsers[userInformationIndex].email;
        asideUserPhone.innerHTML = dbUsers[userInformationIndex].phone;
        asideUserAddress.innerHTML = dbUsers[userInformationIndex].address;
        asideUserOrganization.innerHTML = dbUsers[userInformationIndex].organization;
      }
    })
    .catch(error => console.log(error));

})();