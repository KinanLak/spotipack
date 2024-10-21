const path = require("path"); // Utilisé pour travailler avec les chemins de fichiers
const HtmlWebpackPlugin = require("html-webpack-plugin"); // Plugin pour générer automatiquement un fichier HTML qui inclut les bundles
const Dotenv = require("dotenv-webpack"); // Plugin pour charger les variables d'environnement depuis un fichier .env
const { SourceMapDevToolPlugin } = require("webpack"); // Plugin pour générer des source maps
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // Plugin pour extraire les styles dans un fichier séparé



module.exports = {
    entry: "./src/entry.ts", // Point d'entrée de l'application, ici le fichier principal JavaScript
    output: {
        filename: "bundle.js", // Nom du fichier de sortie pour le bundle généré
        path: path.resolve(__dirname, "dist"), // Répertoire de sortie (généralement 'dist' pour distribution)
        clean: true, // Nettoie le répertoire de sortie avant chaque build
    },
    module: {
        rules: [
            {
                test: /\.ts$/, // Add rule for TypeScript files
                exclude: /node_modules/,
                use: {
                    loader: "ts-loader",
                },
            },
            {
                test: /\.js$/, // Utilise cette règle pour tous les fichiers avec l'extension .js
                exclude: /node_modules/, // Ignore les fichiers dans node_modules
                use: {
                    loader: "babel-loader", // Utilise Babel pour transpiler le code ES6+ vers ES5 pour compatibilité
                },
            },
            {
                test: /\.(css|scss)$/, // Fichiers styles
                use: [
                    MiniCssExtractPlugin.loader, // Injecte les styles dans le DOM ou les extrait dans un fichier séparé
                    { loader: "css-loader" },
                    { loader: "postcss-loader" },
                    { loader: "sass-loader" },
                ], // 'style-loader' injecte les styles dans le DOM, 'css-loader' interprète @import et url() comme import/require
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|ico)$/i, // Gestion des fichiers images
                type: "asset/resource", // Gère les fichiers statiques comme des ressources (ils sont copiés dans 'dist')
            },
            {
                test: /\.html$/,
                use: ["html-loader"], // Permet d'importer des fichiers HTML dans les fichiers JavaScript
            },
            {
                test: /\.json$/,
                type: "json",
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/template.html", // Utilise un fichier HTML comme modèle pour générer le fichier final
            filename: "index.html", // Nom du fichier généré
            favicon: path.resolve(__dirname, "./src/images/favicon.ico"),
        }),
        new Dotenv({
            path: "./.env",
        }),
        new SourceMapDevToolPlugin({
            filename: "[file].map",
            exclude: ["vendor.js", "node_modules/@fortawesome/fontawesome-free/css/all.min.css"], // Exclut FontAwesome et tout fichier tiers ou non nécessaire
            append: "\n//# sourceMappingURL=[url]", // Ajoute la source map à la fin du fichier
            exclude: ["vendor.js"], // Exclut les fichiers tiers comme FontAwesome
        }),
        new MiniCssExtractPlugin({
            filename: "styles.css", // Nom du fichier de styles généré
        }),
    ],
    resolve: {
        extensions: [".ts", ".js"], // Extensions à résoudre automatiquement (par défaut '.js')
        // Optional: ajouter d'autres extensions comme '.jsx' ou '.ts' si besoin
        // extensions: ['.js', '.jsx', '.ts'],
    },
};
