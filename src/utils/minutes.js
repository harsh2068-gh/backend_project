const intoMinutes = (seconds) => {
    return `${Math.floor(seconds / 60)} minutes and ${Math.floor(seconds % 60)} seconds`
}

export { intoMinutes }