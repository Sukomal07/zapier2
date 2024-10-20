import { NextRequest, NextResponse } from "next/server";
import { sendMail } from "@repo/email/email";
import { verifyOtp } from "../../../lib/otpStore";
import prisma from "@repo/db/client";

export async function POST(request: NextRequest) {
    try {
        const { email, otp } = await request.json();

        if (!email || !otp) {
            return NextResponse.json({ message: "Email and Otp are required" }, { status: 400 });
        }

        const isVerified = verifyOtp(email, otp);

        const mailOption = {
            toMail: email,
            subject: "Verification successful",
            message: `Your email ${email} has been verified successfully. You can now log in. If you did not generate a verification OTP, please ignore this email.`
        };

        if (isVerified) {
            try {
                const user = await prisma.user.findFirst({
                    where: {
                        email: email
                    }
                });

                if (!user) {
                    return NextResponse.json({ message: "User not found" }, { status: 404 });
                }

                if (user.verified) {
                    return NextResponse.json({ message: "Email already verified" }, { status: 400 });
                }

                await sendMail(mailOption);

                user.verified = true;
                await prisma.user.update({
                    where: { email: email },
                    data: { verified: true }
                });

                return NextResponse.json({ message: "Email verified successfully" }, { status: 200 });
            } catch (error: any) {
                return NextResponse.json({ message: "Failed to verify OTP", error: error.message }, { status: 500 });
            }
        } else {
            return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
        }

    } catch (error: any) {
        return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
    }
}