export const sleep = (time: number) => { return new Promise((resolve) => { setTimeout(() => resolve("slept well"), time * 1000) }); };
