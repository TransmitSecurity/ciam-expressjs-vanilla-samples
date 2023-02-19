async function loginWithEmail(email) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/email-otp");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        if (xhr.status === 201 || xhr.status === 200) {
            console.log(xhr.responseText);
        } else {
            console.error(xhr.responseText);
        }
        console.log(`the response status is: ${xhr.status}`);
    };
    xhr.send(JSON.stringify({email}));
}
