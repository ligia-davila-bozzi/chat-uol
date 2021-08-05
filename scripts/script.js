

function getMessages(){
    const promise = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages");

    promise.then(showMessages);
}

function showMessages(response){
    const main = document.querySelector("main");

    main.innerHTML = "";
    for(let i = 0; i < response.data.length; i++){

        main.innerHTML += `
        <div class=${response.data[i].type}>
            <pre><span class="time">(${response.data[i].time})</span>  <span class="person">${response.data[i].from}</span> para <span class="person">${response.data[i].to}:</span>  ${response.data[i].text}</pre>
        </div>
        `
        
    }
}


getMessages();