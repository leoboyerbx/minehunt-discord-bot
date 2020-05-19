import { Minehut } from "./lib/minehut-api";
import * as dotenv from "dotenv";
dotenv.config();

(async () => {
    const minehut = new Minehut()
    await minehut.login(process.env.EMAIL|| '', process.env.PASSWORD || '')
    const myserver = await minehut.servers.fetchOne('5ec2e2c5b3db9e00734d9243')
    const status = await myserver.getStatus()
    console.log(status)
})();
