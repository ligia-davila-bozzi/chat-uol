let username;
let lastMessage = {};

function enterRoom(){
    username = prompt("Qual o seu nome?");
    const promise = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants", {name: username});

    promise.then(getMessages);
    promise.catch(validateName);
    setInterval(getMessages, 3000);
    setInterval(maintainConexion, 5000);
}

function validateName(error){
    if(error.response.status === 400){
        alert("Usuário já existente!");
        enterRoom();
    }
}

function maintainConexion(){
    const promise = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status", {name: username});
}

function getMessages(){
    const promise = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages");

    promise.then(showMessages);
}

function showMessages(response){
    const main = document.querySelector("main");

    main.innerHTML = "";
    for(let i = 0; i < response.data.length; i++){

        if(response.data[i].type === "status"){
            main.innerHTML += `
            <div class=${response.data[i].type}>
                <pre><span class="time">(${response.data[i].time})</span>  <span class="person">${response.data[i].from}</span>  ${response.data[i].text}</pre>
            </div>
            `
        }
        else if(response.data[i].type === "message"){
            main.innerHTML += `
            <div class=${response.data[i].type}>
                <pre><span class="time">(${response.data[i].time})</span>  <span class="person">${response.data[i].from}</span> para <span class="person">${response.data[i].to}:</span>  ${response.data[i].text}</pre>
            </div>
            `
        }
        else if(response.data[i].type === "private_message"){
            if(isItYou(response.data[i].from) || isItYou(response.data[i].to)){
                main.innerHTML += `
                <div class=${response.data[i].type}>
                    <pre><span class="time">(${response.data[i].time})</span>  <span class="person">${response.data[i].from}</span> reservadamente para <span class="person">${response.data[i].to}:</span>  ${response.data[i].text}</pre>
                </div>
                `
            }
        }
    }


    scrollMessages();

}

function scrollMessages(){
    const messages = document.querySelectorAll("main div");
    const newLastMessage = messages[messages.length - 1];
    if(newLastMessage.innerHTML !== lastMessage.innerHTML){
        newLastMessage.scrollIntoView();
        lastMessage = newLastMessage;
    }
}

function isItYou(messageName){
    if(username === messageName) return true;
    else return false;
}

function sendMessage(){
    const message = document.querySelector("input").value;

    const promise = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages", {
        from: username,
        to: "Todos",
        text: message,
        type: "message"
    });

    document.querySelector("input").value = "";
    promise.then(getMessages);
}

function enterKey(){
    document.querySelector("input").addEventListener("keypress", function(event){
        if(event.keyCode === 13){
            document.querySelector(".send-button").click();
        }
    })
}

function showParticipants(){
    const modal = document.querySelector(".modal");
    modal.style.display = "initial";
}

enterKey();



