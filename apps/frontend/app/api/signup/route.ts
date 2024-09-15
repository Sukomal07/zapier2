import { NextRequest, NextResponse } from "next/server";
import prisma from "@repo/db/client";
import bcrypt from 'bcrypt';
import { signupSchema } from "../../../types/authTypes";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { error } = signupSchema.safeParse(body)

        if (error) {
            throw new Error(error.message);
        }

        // Check if the user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                email: body.email
            }
        });

        if (existingUser) {
            return NextResponse.json({ message: "User with this email already exists" }, { status: 400 });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(body.password, 10);

        // Create a new user
        const newUser = await prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
                verified: false,
                password: hashedPassword
            }
        });

        return NextResponse.json({ message: "User created successfully", user: newUser }, { status: 201 });
    } catch (e: any) {
        return NextResponse.json({ message: "Internal server error", error: e.message }, { status: 500 });
    }
}
