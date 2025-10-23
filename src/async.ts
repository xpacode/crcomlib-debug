const timeout = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

export const Async = {
    timeout,
};
