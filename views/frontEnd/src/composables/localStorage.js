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

    saveIsMobile(state, storageKey='aeprMobile') {
        localStorage.setItem(storageKey, JSON.stringify({isMobile: state}))
    }

    getIsMobile(storageKey='aeprMobile') {
        const isMobileObj = JSON.parse(localStorage.getItem(storageKey))
        if (isMobileObj.isMobile) {
            return isMobileObj.isMobile
        }
        return false;
    }

    mergeObjs(aObj, bObjs) {
        return {
            ...aObj,
            ...bObjs,
        };
    }
}