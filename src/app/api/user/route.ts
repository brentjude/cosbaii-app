import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hash } from "bcrypt";
import { z } from "zod";

//Defining schema for input validation
const userSchema = z.object({
    email: z
        .string()
        .email("Invalid email format")
        .min(1, "Email is required"),
    username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username must be less than 20 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
        .optional(),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number")
});


export async function POST(req: Request) {
    try {
        const body = await req.json();

        const validationResult = userSchema.safeParse(body)

        if(!validationResult.success) {
            return NextResponse.json({
                message: "Validation failed",
                error: validationResult.error.flatten().fieldErrors
            }, { status: 400 });
        }

        const { email, username, password } = validationResult.data;

        // check if the email already exists
        const existingUserByEmail = await prisma.user.findUnique({
            where: { email: email }
        });

        if(existingUserByEmail) {
            return NextResponse.json({ user: null, message: "User with this email already exists"}, { status: 409 })
        }

        // check if the username already exists
        const existingUserByUsername = await prisma.user.findUnique({
            where: { username: username }
        })


        if(existingUserByUsername) {
            return NextResponse.json({ username: null, message: "User with this username already exists"}, { status: 409 })
        }

         const hashedPassword = await hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        })

        const { password: newUserPassword, ...rest} = newUser;

        return NextResponse.json({
            user: rest,
            message: "User created successfully"
        }, {
            status: 201
        });

    } catch(error) {
        console.error("User creation error:", error);
        return NextResponse.json(
            {
                message: "Internal server error"
            }, { status: 500}
        )
    }
}