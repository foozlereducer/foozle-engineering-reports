export class LocalStorage {
    constructor(authStore) {
        this.authStore = authStore;
    }

    saveAuthCredentials(userData, storageKey='aeprUser') {
        localStorage.setItem(storageKey,  JSON.stringify(userData))
        console.log('userData stringified', localStorage.getItem(storageKey)); 
    }

    getAuthData(storageKey='aeprUser') {
        return JSON.parse(localStorage.getItem(storageKey));
    }

    mergeObjs(aObj, bObjs) {
        return {
            ...aObj,
            ...bObjs,
        };
    }
}