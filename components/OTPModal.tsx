"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { sendEmailOtp, verifySecret } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";

type OTPModalPropTypes = {
  email: string;
  accountId: string;
};

const OtpModal = ({ email, accountId }: OTPModalPropTypes) => {
  const [isOpen, setIsOpen] = useState(true);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Call API to verify OTP
      const sessionId = await verifySecret({ accountId, password });
      if (sessionId) router.push("/");
    } catch (e) {
      console.log("Failed to verify OTP");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      console.log(e.message);
    }
    setIsLoading(false);
  };

  const handleResendOTP = async () => {
    try {
      await sendEmailOtp({ email });
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      console.log(e.message);
    }
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className={"shad-alert-dialog"}>
        <AlertDialogHeader className={"relative flex justify-center"}>
          <AlertDialogTitle className={"h2 text-center"}>
            Enter your OTP
            <Image
              src={"/assets/icons/close-dark.svg"}
              alt={"close"}
              width={20}
              height={20}
              onClick={() => setIsOpen(false)}
              className={"otp-close-button"}
            />
          </AlertDialogTitle>
          <AlertDialogDescription>
            We&#39;ve sent a code to{" "}
            <span className={"text-brand pl-1"}>{email}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <InputOTP maxLength={6} value={password} onChange={setPassword}>
          <InputOTPGroup className={"shad-otp"}>
            <InputOTPSlot index={0} className={"shad-otp-slot"} />
            <InputOTPSlot index={1} className={"shad-otp-slot"} />
            <InputOTPSlot index={2} className={"shad-otp-slot"} />
            <InputOTPSlot index={3} className={"shad-otp-slot"} />
            <InputOTPSlot index={4} className={"shad-otp-slot"} />
            <InputOTPSlot index={5} className={"shad-otp-slot"} />
          </InputOTPGroup>
        </InputOTP>

        <AlertDialogFooter>
          <div className={"flex w-full flex-col gap-4"}>
            <AlertDialogAction
              onClick={handleSubmit}
              className={"shad-submit-btn h-12"}
              type={"button"}
            >
              Submit
              {isLoading && (
                <Image
                  src={"/assets/icons/loader.svg"}
                  alt={"loader"}
                  width={24}
                  height={24}
                  className={"ml-2 animate-spin"}
                />
              )}
            </AlertDialogAction>
            <div className={"subtitle-2 mt-2 text-center text-light-100"}>
              Didn&apos;t get a code?{" "}
              <Button
                type={"button"}
                variant={"link"}
                className={"pl-1 text-brand"}
                onClick={handleResendOTP}
              >
                Resend
              </Button>
            </div>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default OtpModal;
