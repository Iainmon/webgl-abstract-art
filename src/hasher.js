const clamp = (num, min, max) => (num <= min ? min : num >= max ? max : num)
const fract = num => num - Math.floor(num)

export const shuffle = function (characters, count, lastIndex = 0) {
    if (count < 1) return characters
    const first = characters[lastIndex]
    const shuffleVector = Math.floor(clamp(fract(first.charCodeAt(0) * 0.1) * 10, 0, characters.length - 1))
    const temp = characters[shuffleVector]
    characters[shuffleVector] = characters[lastIndex]
    characters[lastIndex] = temp
    const nextIndex = (lastIndex + shuffleVector * characters.length - shuffleVector) % characters.length
    return shuffle(characters, count - 1, nextIndex)
}

export const characterCodes = function (characters) {
    const codes = []
    for (const character of characters) codes.push(character.charCodeAt(0))
    return codes
}

export const linearTreeReduction = function (list, desiredLength) {
    const length = list.length

    if (length <= desiredLength) return list

    const reduced = []
    for (const index in list) {
        if (index == length - 1 && length % 2 > 0) break
        if (index > 1) {
            const average = Math.floor((list[index] + list[index - 2]) * .5)
            reduced.push(average)
        }
    }
    return linearTreeReduction(reduced, desiredLength)
}

export const obfuscate = function (list) {
    const base = Math.E
    const normalized = (list).map(n => (Math.log(n) / Math.log(base)) * base ).map(n => fract(n))
    return normalized
}

const hash = function (text) {
    const characters = text.split('')
    const shuffled = shuffle(characters, characters.length * 2)
    const codes = characterCodes(shuffled)
    const reduced = linearTreeReduction(codes, 4)
    const obfuscated = obfuscate(reduced)
    return obfuscated
}
export default hash