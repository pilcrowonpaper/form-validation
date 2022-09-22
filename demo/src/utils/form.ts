import { Form } from "adria-forms";

export const form = new Form()
    .field("email", (value) => {
        if (!value) return "Please enter your email";
        if (typeof value !== "string") return "Invalid input";
        if (!value.match(/.+@.+\..+/)) return "Please enter a valid email";
    })
    .field("password", (value) => {
        if (!value) return "Please enter your password";
        if (typeof value !== "string") return "Invalid input";
        if (value.length < 8)
            return "Password must be at least 8 characters long";
    })
    .field("password-confirm", (value) => {
        if (!value) return "Please confirm your password";
        if (typeof value !== "string") return "Invalid input";
        if (value.length < 8) return "The password does not match";
    });
