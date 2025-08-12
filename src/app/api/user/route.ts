import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hash } from "bcrypt";
import { z } from "zod";
import { BadgeTriggers } from '@/lib/badgeTriggers';
import { sendWelcomeEmail } from '@/lib/email';

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

        // Validate input data using zod
        const validationResult = userSchema.safeParse(body)

        // If validation fails, return an error response
        if(!validationResult.success) {
            return NextResponse.json({
                message: "Validation failed",
                error: validationResult.error.flatten().fieldErrors
            }, { status: 400 });
        }

        // Extract validated data
        // This will ensure that the data conforms to the schema
        const { email, username, password } = validationResult.data;

        // check if the email already exists
        const existingUserByEmail = await prisma.user.findUnique({
            where: { email: email }
        });

        // If the email already exists, return an error response
        if(existingUserByEmail) {
            return NextResponse.json({ user: null, message: "Email is already taken. Please use a different email."}, { status: 409 })
        }

        // check if the username already exists
        const existingUserByUsername = await prisma.user.findUnique({
            where: { username: username }
        })


        // If the username already exists, return an error response
        // This will ensure that the username is unique
        if(existingUserByUsername) {
            return NextResponse.json({ username: null, message: "Username is already taken. Please choose a different one."}, { status: 409 })
        }

        // Hash the password before storing it in the database
        // This will ensure that the password is stored securely
        const hashedPassword = await hash(password, 10);

        // Create a new user in the database
        // This will insert the user data into the database
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        })

        // Trigger badges
        try {
        const { BadgeTriggers } = await import('@/lib/badgeTriggers');
        await BadgeTriggers.onUserRegistration(newUser.id);
        } catch (badgeError) {
        console.error('Error triggering badges:', badgeError);
        }

        // Send welcome email after user creation
        try {
        const emailResult = await sendWelcomeEmail(newUser.email, newUser.name || 'Cosplayer');
        if (emailResult.success) {
            console.log('Welcome email sent to:', newUser.email);
        } else {
            console.error('Failed to send welcome email:', emailResult.error);
        }
        } catch (emailError) {
        console.error('Error sending welcome email:', emailError);
        // Don't fail the registration if email fails
        }

        // Exclude the password from the response
        // This will ensure that the password is not exposed in the response
        const { password: newUserPassword, ...rest} = newUser;

        // Return a success response with the created user data
        // This will return the user data without the password
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