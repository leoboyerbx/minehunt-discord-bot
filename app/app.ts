import { Minehut } from "./lib/minehut-api";

(async () => {
    const minehut = new Minehut()
    await minehut.login('lboyer1@live.fr', 'Pee@gu0311')
    const myserver = await minehut.servers.fetchOneByName('leoetzozo')
    const res = await myserver.getStatus()
    console.log(res)
})();
