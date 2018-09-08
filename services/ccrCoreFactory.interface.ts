export const claimsRegistry = () => { return {} }

export const deployCCR = (_name: string, _quorum: string) => { 
    return {
        subject: _name,
        quorum: _quorum
    } 
}

export const getRegistry = () => { return {} }
