export class LocalStorage {
    constructor(authStore) {
        this.authStore = authStore;
    }

    saveAuthCredentials(userData, storageKey='aeprUser') {
        localStorage.setItem(storageKey,  JSON.stringify(userData))
    }

    getAuthData(storageKey='aeprUser') {
        return JSON.parse(localStorage.getItem(storageKey));
    }

    removeAuthData(storageKey='aeprUser') {
        localStorage.removeItem(storageKey);
    }

    saveIsMobile(state, storageKey='aeprMobile') {
        localStorage.setItem(storageKey, JSON.stringify({isMobile: state}))
    }

    getIsMobile(storageKey='aeprMobile') {
        const isMobileObj = JSON.parse(localStorage.getItem(storageKey));
        if (isMobileObj && isMobileObj.isMobile) {
            return isMobileObj.isMobile;
        }
        return false;
    }

    removeIsMobile(storageKey='aeprMobile'){
        localStorage.removeItem(storageKey);
    }


    mergeObjs(aObj, bObjs) {
        return {
            ...aObj,
            ...bObjs,
        };
    }
}