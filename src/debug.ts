import { CrComLib } from "@pepperdash/ch5-crcomlib-lite";
import { Async } from "./async";

const logKnownStates = () => {
    const subscriptions = CrComLib.getSubscriptionsCount() as Record<
        string,
        any
    >;

    const bags: any[] = Object.values(subscriptions);
    const signals: any[] = bags.flatMap((bag) => Object.values(bag));
    signals.forEach((signal) => {
        console.log(
            `${signal.type}/${signal.name}: ${JSON.stringify(signal.value)}`
        );
    });
};

const stateBombAsync = (start: number, end: number): Promise<string[]> => {
    return new Promise((resolve, _) => {
        const result: string[] = [];
        for (let index = start; index < end; index++) {
            const join = `Csig.fb${index}`;
            const boolValue = CrComLib.getState("b", join) as boolean;
            if (boolValue !== null) result.push(`${join}/${boolValue}`);
            const numberValue = CrComLib.getState("n", join) as number;
            if (numberValue !== null) result.push(`${join}/${numberValue}`);
            const stringValue = CrComLib.getState("s", join) as string;
            if (stringValue !== null) result.push(`${join}/${stringValue}`);
            const objectValue = CrComLib.getState("o", join) as Record<
                string,
                any
            >;
            if (objectValue !== null)
                result.push(`${join}/${JSON.stringify(objectValue)}`);
            resolve(result);
        }
    });
};

const stepJoinsAsync = async (): Promise<string[]> => {
    const chunks = 30;
    const chunkSize = 65535 / chunks;
    const chunkedResult: string[][] = [];

    for (let index = 0; index < chunks; index++) {
        console.log("Starting new chunk");
        const start = Math.round(index * chunkSize);
        const end = Math.round(start + chunkSize);
        console.log(`Checking chunk with first index ${start}`);
        const result = await stateBombAsync(start, end);
        chunkedResult.push(result);
        console.log("Finished chunk");
        await Async.timeout(5000);
    }

    console.log("Finished bombing");
    logKnownStates();
    return chunkedResult.flat();
};

export const Debug = {
    stepJoinsAsync,
    logKnownStates,
};
