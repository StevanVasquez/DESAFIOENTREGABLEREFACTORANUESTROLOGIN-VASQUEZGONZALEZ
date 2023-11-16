import passport from "passport";
import GitHubStrategy from "passport-github2";
import userModel from "../dao/models/user.model.js";

const GITHUB_CLIENT_ID = "Iv1.a9af47638a84f7be";
const GITHUB_CLIENT_SECRET = "2280ef0f1e3d53105254e1af5fda5aae94471b97";
const initializePassport = () => {
    passport.use("github", new GitHubStrategy({ clientID: GITHUB_CLIENT_ID, clientSecret: GITHUB_CLIENT_SECRET, callbackURL: "http://localhost:8080/api/session/github/callback",
        },
        async (accesToken, refreshToken, profile, done) => {
        try {
            let user = await userModel.findOne({ email: profile._json?.email });
            if (!user) {
                let addNewUser = {
                    first_name: profile._json.name,
                    last_name: "",
                    email: profile._json.email,
                    age: 22,
                    password: "",
                }
                let newUser = await userModel.create(addNewUser);
                done(null, newUser);
            } else {
                done(null, user);
            }
        } catch (err) {
            return done(err);
        }
    }
    )
);
passport.serializeUser((user, done) => {
    done(null, user._id);
});
passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById({ _id: id });
        done(null, user);
    });
};
export default initializePassport;