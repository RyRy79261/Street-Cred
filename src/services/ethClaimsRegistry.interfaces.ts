export const setClaim = (_subject:string, _key: string, _value: string) => {
    return {
        subject: _subject,
        key: _key,
        value: _value
    };
}

export const setSelfClaim = (_key:string, _value: string) => {
    return {
        key: _key,
        value: _value
    };
}

export const getClaim = (_issuer: string, _subject:string, _value: string) => {
    return {
        issuer: _issuer,
        subject: _subject,
        value: _value
    };
}

export const removeClaim = (_issuer: string, _subject:string, _key: string) => {
    return {
        issuer: _issuer,
        subject: _subject,
        key: _key
    };
}