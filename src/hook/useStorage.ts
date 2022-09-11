const useStorage = () => {
    const getStorage = (key: string): any => {
        if (localStorage.getItem(key) !== null) {
            return JSON.parse(localStorage.getItem(key) as any);
        }
        return null;
    };
    const setStorage = (key: string, data: any) => {
        localStorage.setItem(key, JSON.stringify(data));
    };
    return { getStorage, setStorage };
};

export default useStorage;
