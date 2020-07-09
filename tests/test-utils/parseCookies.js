module.exports = (cookies) => {
    const result = new Map();

    for (const cookie of cookies) {
        const parts = cookie.split('; ');
        const first = parts.shift().split('=');

        const content = {
            value: first[1],
        };

        for (let part of parts) {
            if (part.includes('=')) {
                const values = part.split('=');
                content[values[0]] = values[1];
            } else {
                content[part] = true;
            }    
        }

        result.set(first[0], content);
    }

    return result;
};
