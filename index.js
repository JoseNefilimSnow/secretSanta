const fs = require('fs-extra');
require('dotenv/config');
const configTel = require("./configTel.json");
const TelegramBot = require('node-telegram-bot-api');
let list = ["Yonay Sar", "Miriam", "Lya", "Suale", "Leonardo", "Andrea", "Bryan", "Jose"];

const botTel = new TelegramBot(process.env.TOKEN_TELEGRAM, {
    polling: true
});

botTel.on("message", async message => {
    if (message.text != undefined) {
        if (message.text.indexOf(configTel.prefix) !== 0) return;

        const args = message.text.slice(configTel.prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();


        switch (command) {

            case "start":

                botTel.sendMessage(message.chat.id, "¡Hola! He llegado a Telegram");
                break;

            case "soyunvago":
                botTel.sendMessage(message.from.id, "Para los vagos que no quieren pensar os dejo el comando ")
                switch (message.from.first_name) {
                    case "Yonay Sar":
                        raffle(list.indexOf(message.from.first_name), null, null, message.from.id)
                        break;
                    case "Miriam":
                        raffle(list.indexOf(message.from.first_name), list.indexOf("Jose"), list.indexOf("Yonay Sar"), message.from.id)
                        break;
                    case "Jose":
                        raffle(list.indexOf(message.from.first_name), list.indexOf("Miriam"), list.indexOf("Andrea"), message.from.id)
                        break;
                    case "Andrea":
                        raffle(list.indexOf(message.from.first_name), list.indexOf("Suale"), list.indexOf("Bryan"), message.from.id)
                        break;
                    case "Suale":
                        raffle(list.indexOf(message.from.first_name), list.indexOf("Andrea"), list.indexOf("Leonardo"), message.from.id)
                        break;
                    case "Bryan":
                        raffle(list.indexOf(message.from.first_name), list.indexOf("Lya"), list.indexOf("Jose"), message.from.id)
                        break;
                    case "Lya":
                        raffle(list.indexOf(message.from.first_name), list.indexOf("Bryan"), null, message.from.id)
                        break;
                    case "Leonardo":
                        raffle(list.indexOf(message.from.first_name), list.indexOf("Miriam"), null, message.from.id)
                        break;
                }
                break;

            case "raffle":
                let tua = (args[0]) - 1
                let randoma = Math.floor(Math.random() * (list.length - 0) + 0);
                let checkLista = false;
                for (let personaA of list) {
                    if (personaA.person !== "none" && personaA.person !== list[tua].person) {
                        checkLista = true;
                        break;
                    }
                }
                if (checkLista) {
                    while (randoma === tua || list[randoma].person === "none") {
                        randoma = Math.floor(Math.random() * (list.length - 0) + 0);
                    }
                    await botTel.sendMessage(message.from.id, "Te ha tocado: " + list[randoma].person)
                    list[randoma] = {
                        person: "none"
                    };
                    break;

                } else {
                    await botTel.sendMessage(message.from.id, "No hay nadie mas en la lista");
                    break;
                }

            case "check":
                botTel.sendMessage(message.chat.id, "Comprobando: ").then(done => {
                    for (let persona of list) {
                        console.log("personas", persona, persona != message.from.first_name);
                    }
                    console.log(list.every(person => person == "none" || person != message.from.first_name))
                    if (list.every(person => person == "none" || person == message.from.first_name)) {
                        botTel.sendMessage(message.chat.id, "¡¡Todo correcto!!")

                    } else {
                        botTel.sendMessage(message.chat.id, "Puede que haya un problema")
                    }
                });
                break;

        }
    }

})

async function raffle(tu, exclude, exclude2, idToSend) {

    let random = Math.floor(Math.random() * (list.length - 0) + 0);
    let checkList = false;
    for (let persona of list) {
        if (exclude2 != null) {
            if (persona !== "none" && persona !== list[tu] && persona !== list[exclude] && persona !== list[exclude2]) {
                console.log("entro")
                checkList = true;
                break;
            }
        } else if (exclude != null) {
            if (persona !== "none" && persona !== list[tu] && persona !== list[exclude]) {
                console.log("entro")
                checkList = true;
                break;
            }
        } else if (tu != null) {
            if (persona !== "none" && persona !== list[tu]) {
                console.log(tu)
                console.log("entro")
                checkList = true;
                break;
            }
        }
    }

    if (checkList) {
        if (exclude != null && exclude2 == null) {
            while (exclude === random || random === tu || list[random] === "none") {
                random = Math.floor(Math.random() * (list.length - 0) + 0);
            }
            await botTel.sendMessage(idToSend, "Te ha tocado: " + list[random])
            list[random] = "none";
            return;
        } else if (exclude2 != null && exclude != null) {
            while (exclude === random || exclude2 === random || random === tu || list[random] === "none") {
                random = Math.floor(Math.random() * (list.length - 0) + 0);
            }
            await botTel.sendMessage(idToSend, "Te ha tocado: " + list[random])
            list[random] = "none";
            return;
        } else if (exclude2 == null && exclude == null) {
            while (random === tu || list[random] === "none") {
                random = Math.floor(Math.random() * (list.length - 0) + 0);
            }
            await botTel.sendMessage(idToSend, "Te ha tocado: " + list[random])
            list[random] = "none";
            return;
        }
    } else {
        await botTel.sendMessage(idToSend, "No hay nadie mas en la lista");
        return;
    }
}