import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MailCheck } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <MailCheck className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Check Your Email
          </h1>
          <p className="text-sm text-muted-foreground">
            We sent you a confirmation link. Click it to activate your account and start collecting!
          </p>
        </div>
        <Button asChild variant="outline" className="w-full">
          <Link href="/auth/login">Back to Sign In</Link>
        </Button>
      </div>
    </div>
  )
}
