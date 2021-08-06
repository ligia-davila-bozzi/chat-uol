let username, checkedPerson;
let lastMessage = {};
let isFirstTime = true;
let messageTo = "Todos", messageType = "message";


function enterRoom(){
    username = prompt("Qual o seu nome?");
    const promise = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants", {name: username});

    promise.then(getMessages);
    promise.catch(validateName);
    setInterval(getMessages, 3000);
    setInterval(maintainConexion, 5000);
    setInterval(getParticipants, 10000);
    
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
    if(isFirstTime){
        getParticipants();
        isFirstTime = false;
    }
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
    let message = document.querySelector("input").value;

    const promise = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages", {
        from: username,
        to: messageTo,
        text: message,
        type: messageType
    });

    document.querySelector("input").value = "";
    promise.then(getMessages);
    promise.catch(errorSendMessage);
}

function errorSendMessage(){
    alert("Você não está mais logado. Por favor, logue novamente.");
    window.location.reload();
}

function enterKey(){
    document.querySelector("input").addEventListener("keypress", function(event){
        if(event.keyCode === 13){
            document.querySelector(".send-button").click();
        }
    })
}

function showParticipantsMenu(){
    const modal = document.querySelector(".modal");
    modal.classList.add("display");

    window.onclick = function(event){
        if(event.target === modal){
            modal.classList.remove("display");
        }
    }
}

function getParticipants(){
    const promise = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants");

    promise.then(showParticipants);
}

function showParticipants(participants){
    const contacts = document.querySelector(".contacts");
    contacts.innerHTML = "";

    if(checkedPerson === undefined){
        contacts.innerHTML += `
        <div class="contact" onclick="select(this);">
            <ion-icon name="people"></ion-icon> 
            <div class="name-and-check everyone check-on">
                <span>Todos</span>
                <img src="images/Vector.png" alt="Marcado">
            </div>
        </div>
        `
    }
    else{
        contacts.innerHTML += `
        <div class="contact" onclick="select(this);">
            <ion-icon name="people"></ion-icon> 
            <div class="name-and-check everyone">
                <span>Todos</span>
                <img src="images/Vector.png" alt="Marcado">
            </div>
        </div>
        `
    }
    

    for(let i = 0; i < participants.data.length; i++){
        if(checkedPerson === participants.data[i].name){
            contacts.innerHTML += `
            <div class="contact" onclick="select(this);">
                <ion-icon name="person-circle"></ion-icon>
                <div class="name-and-check check-on participant">
                    <span>${participants.data[i].name}</span>
                    <img src="images/Vector.png" alt="Marcado">
                </div>
            </div>
            `
        }
        else{
            contacts.innerHTML += `
            <div class="contact" onclick="select(this);">
                <ion-icon name="person-circle"></ion-icon>
                <div class="name-and-check participant">
                    <span>${participants.data[i].name}</span>
                    <img src="images/Vector.png" alt="Marcado">
                </div>
            </div>
            `
        }
        
    }
}

function select(element){
    let contactsChecked = document.querySelector(".contacts .check-on");
    let visibilitiesChecked = document.querySelector(".visibilities .check-on");

    if(contactsChecked !== null && element.classList.contains("contact")){
        contactsChecked.classList.remove("check-on");
    }
    if(visibilitiesChecked !== null && element.classList.contains("visibility")){
        visibilitiesChecked.classList.remove("check-on");
    }

    element.querySelector(".name-and-check").classList.add("check-on");

    if(document.querySelector(".visibilities .check-on span").innerHTML === "Público" && document.querySelector(".contacts .check-on span").innerHTML !== "Todos"){
        document.querySelector(".contacts .check-on").classList.remove("check-on");
        document.querySelector(".contacts .everyone").classList.add("check-on");
    }

    if(document.querySelector(".visibilities .check-on span").innerHTML === "Reservadamente" &&document.querySelector(".contacts .everyone").classList.contains("check-on")){
        document.querySelector(".contacts .everyone").classList.remove("check-on");
        document.querySelector(".contacts .participant").classList.add("check-on");
    }

    if(document.querySelector(".contact .check-on").classList.contains("participant")){
        checkedPerson = document.querySelector(".contact .check-on span").innerHTML;
    }
    else{
        checkedPerson = undefined;
    }

    checkReserved();
}

function checkReserved(){
    const reserved = document.querySelector(".reserved");
    const newContactChecked = document.querySelector(".contacts .check-on");

    if(reserved.classList.contains("check-on") && newContactChecked !== null){
        sendReservedMessage(true, newContactChecked.querySelector("span").innerHTML);
    }
    else{
        sendReservedMessage(false, "Todos");
    }
}

function sendReservedMessage(isReservedChecked, receiver){
    const textBox = document.querySelector(".text-box");
    textBox.innerHTML = "";
    if(isReservedChecked){
        textBox.innerHTML = `
        <div class="write-here">
            <input type="text" placeholder="Escreva aqui...">
            <span>Enviando para ${receiver} (reservadamente)</span>
        </div>
        <ion-icon name="paper-plane-outline" onclick="sendMessage();" class="send-button"></ion-icon>
        `

        messageTo = receiver;
        messageType = "private_message";
        enterKey();
    }
    else{
        textBox.innerHTML = `
        <input type="text" placeholder="Escreva aqui...">
        <ion-icon name="paper-plane-outline" onclick="sendMessage();" class="send-button"></ion-icon>
        `

        messageTo = receiver;
        messageType = "message";
        enterKey();
    }
}

enterKey();
enterRoom();