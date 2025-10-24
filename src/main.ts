import { CrComLib } from "@pepperdash/ch5-crcomlib-lite";
import { Async } from "./async";
import { Debug } from "./debug";
import eruda from "eruda";

let inputValue = "";

const runTest = async () => {
    console.log(CrComLib.isCrestronTouchscreen());
    await Async.timeout(1000);
    const result = await Debug.stepJoinsAsync();
    console.log(result);
};

const startRemoteJs = (remoteJsKey: string): boolean => {
    if (remoteJsKey === "" || remoteJsKey === undefined) {
        console.warn("invalid remotejs key");
        return false;
    }

    var s = document.createElement("script");
    s.src = "https://remotejs.com/agent/agent.js";
    s.setAttribute("data-consolejs-channel", remoteJsKey);
    document.head.appendChild(s);
    return true;
};

const configure = () => {
    console.log("Configuring");

    const runner: HTMLButtonElement = document.getElementById(
        "runner"
    ) as HTMLButtonElement;
    const start: HTMLElement = document.getElementById("start") as HTMLElement;
    const loading: HTMLElement = document.getElementById(
        "loading"
    ) as HTMLElement;
    const log: HTMLInputElement = document.getElementById(
        "log"
    ) as HTMLInputElement;

    if (runner === undefined) {
        console.error("No runner");
        return;
    }

    if (start === undefined) {
        console.error("No start");
        return;
    }

    if (loading === undefined) {
        console.error("No loading");
        return;
    }

    if (log === undefined) {
        console.error("No log");
        return;
    }

    log.addEventListener("input", (e) => {
        const target = e.target as HTMLInputElement;
        console.log(target.value);
        inputValue = target.value;
    });

    runner.addEventListener("pointerup", async () => {
        try {
            start.style.display = "none";
            loading.style.display = "block";

            console.log("Preparing test");
            startRemoteJs(inputValue);
            await Async.timeout(8000);

            console.log("Starting test");
            await runTest();
            console.log("Test finished");
        } catch (error) {
            console.log(error);
        } finally {
            start.style.display = "flex";
            loading.style.display = "none";
        }
    });
};

eruda.init();
await Async.timeout(1000);
configure();
