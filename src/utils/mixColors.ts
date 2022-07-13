const getRGB = (color: string) => {
    const [r, g, b] = color.slice(1).match(/.{2}/g)!.map(x => parseInt(x, 16))
    return [r, g, b]
}

const getHex = (r: number, g: number, b: number) => {
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

export const mixColors = (color1: string, color2: string, ratio: number): string => {
    const [r1, g1, b1] = getRGB(color1)
    const [r2, g2, b2] = getRGB(color2)
    const r = Math.round(r1 * (1 - ratio) + r2 * ratio)
    const g = Math.round(g1 * (1 - ratio) + g2 * ratio)
    const b = Math.round(b1 * (1 - ratio) + b2 * ratio)
    return getHex(r, g, b)
}