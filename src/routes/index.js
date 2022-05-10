module.exports = (app) => {
    app.use("/api/users", require('../routes/user.route'));
    app.use("/api/roles", require("../routes/role.route"));
    app.use("/api/auth", require("../routes/auth.route"));
    app.use("/api/home", require("../routes/home.route"));
};