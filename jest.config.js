module.exports = {
    testPathIgnorePatterns: ['<rootDir>/node_modules/'],
    transform: {
        '^.+\\.(css|styl|less|sass|scss)$': 'identity-obj-proxy',
    }
};