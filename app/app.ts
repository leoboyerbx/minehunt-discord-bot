import { Minehut } from "./lib/minehut-api";
import dotenv from 'dotenv'

(async () => {
    console.log(process.env.EMAIL)
    const minehut = new Minehut()
    await minehut.login('lboyer1@live.fr', 'Pee@gu0311')
    const myserver = await minehut.servers.fetchOneByName('leoetzozo')
    const res = await myserver.getStatus()
    console.log(res)
})();
