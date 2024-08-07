import { UsernamePasswordInput } from "src/ultis/UsernamePasswordInput"

export const validateRegister = (options: UsernamePasswordInput) => {
    if (!options.email.includes("@")) {
        return  [{
                    field: "email", 
                    message:"Invalid email"
                }]
    }

    if (options.username.includes("@")) {
        return [{
                 field:"username", 
                 message:"cannot include an @"
            }]
    }

    if (options.username.length <= 2) {
        return [{
                 field:"username", 
                 message:"Length must be greater than 2"
            }]
    }

    if (options.password.length <= 2) {
        return [{
                field:"password", 
                message:"Length must be greater than 2"
            }]
        }

    return null 
}