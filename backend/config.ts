import path from "path";

const rootPath = __dirname;

const config = {
    rootPath,
    publicPath: path.join(rootPath, 'public'),
    db: 'mongodb://localhost/petShop',
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        secretId: process.env.GOOGLE_CLIENT_SECRET,
    },
    vk:{
        vkAppId:process.env.VK_APP_ID,
        vkSecurityKey:process.env.VK_SECURE_KEY,
        vkRedirectUri:process.env.VK_REDIRECT_URI,
    },
};

export default config;