import { NextRequest, NextResponse } from "next/server";
import { sendMail } from "@repo/email/email";
import { generateOtp, setOtp } from "../../../lib/otpStore";

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ message: "Email is required" }, { status: 400 })
        }

        const otp = generateOtp()

        const mailOption = {
            toMail: email,
            subject: "Your OTP Code for verification",
            message: `Your OTP code is ${otp}. If you not generate verification otp please ignore.`
        }

        try {
            await sendMail(mailOption)
            setOtp(email, otp)
            return NextResponse.json({ message: "OTP sent successfully" }, { status: 200 })
        } catch (error) {
            return NextResponse.json({ message: "Failed to send OTP" }, { status: 500 })
        }

    } catch (error: any) {
        return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
    }
}