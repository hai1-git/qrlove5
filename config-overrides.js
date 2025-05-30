const { override, useBabelRc, addWebpackAlias } = require("customize-cra");
const path = require("path");

module.exports = override(
    // Sử dụng Babel configuration từ tệp .babelrc
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useBabelRc(),

    // Ghi đè cấu hình alias trong Webpack
    addWebpackAlias({
        "~": path.resolve(__dirname, "src"),
    })
);
