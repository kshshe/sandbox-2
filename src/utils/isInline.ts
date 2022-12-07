let cached: boolean | null = null
export const isInline = (): boolean => {
    if (cached !== null) {
        return cached
    }
    cached = window.location.pathname.includes('inline')
    return cached
}