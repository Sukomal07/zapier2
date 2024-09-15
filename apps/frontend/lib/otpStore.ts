type OtpStore = Record<string, string>;

const otpStore: OtpStore = {};

export function setOtp(identifier: string, otp: string): void {
    otpStore[identifier] = otp;
}

export function getOtp(identifier: string): string | undefined {
    return otpStore[identifier];
}

export function verifyOtp(identifier: string, otp: string): boolean {
    const storedOtp = otpStore[identifier];
    if (!storedOtp) {
        return false;
    }
    return storedOtp === otp;
}


export function generateOtp(length: number = 6): string {
    const characters = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return otp;
}