function createPromise(
    name: string,
    timeout: number,
    start: number,
    timed: Timed
): Promise<void> {
    timed.start = Date.now() - start;
    return new Promise((resolve) => {
        setTimeout(() => {
            timed.end = Date.now() - start;
            resolve();
        }, timeout);
    });
}

function outputTimings(
    testDescription: string,
    timedA: Timed,
    timedB: Timed,
    timedC: Timed
) {
    const orderOfFinish = [timedA, timedB, timedC].sort(
        (a, b) => a.end - b.end
    );

    const logMessage = `
***** ${testDescription} Complete *****
Order of Finish: ${orderOfFinish.map((timed) => timed.name).join(",")}
A: ${timedA.start}:${timedA.end}
B: ${timedB.start}:${timedB.end}
C: ${timedC.start}:${timedC.end}
`;

    console.log(logMessage);
}

class Timed {
    start: number;
    end: number;
    name: string;

    constructor(name: string) {
        this.name = name;
        this.start = -1;
        this.end = -1;
    }
}

it("Chained", async () => {
    const start = Date.now();
    const timedA = new Timed("A");
    const timedB = new Timed("B");
    const timedC = new Timed("C");

    await createPromise("A", 300, start, timedA)
        .then(() => createPromise("B", 1000, start, timedB))
        .then(() => createPromise("C", 100, start, timedC));

    outputTimings("Chained", timedA, timedB, timedC);
});
it("Chained but the promises defined ahead of time", async () => {
    const start = Date.now();
    const timedA = new Timed("A");
    const timedB = new Timed("B");
    const timedC = new Timed("C");

    const promiseA = createPromise("A", 300, start, timedA);
    const promiseB = createPromise("B", 1000, start, timedB);
    const promiseC = createPromise("C", 100, start, timedC);

    await promiseA.then(() => promiseB).then(() => promiseC);

    outputTimings(
        "Chained but the promises defined ahead of time",
        timedA,
        timedB,
        timedC
    );
});
it("A Then B and C in Parallel", async () => {
    const start = Date.now();
    const timedA = new Timed("A");
    const timedB = new Timed("B");
    const timedC = new Timed("C");

    await createPromise("A", 300, start, timedA).then(() =>
        Promise.all([
            createPromise("B", 1000, start, timedB),
            createPromise("C", 100, start, timedC),
        ])
    );
    outputTimings("A Then B and C in Parallel", timedA, timedB, timedC);
});
