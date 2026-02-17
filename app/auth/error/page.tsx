import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive text-destructive-foreground">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Authentication Error
          </h1>
          <p className="text-sm text-muted-foreground">
            Something went wrong during authentication. Please try again.
          </p>
        </div>
        <Button asChild className="w-full">
          <Link href="/auth/login">Back to Sign In</Link>
        </Button>
      </div>
    </div>
  )
}
