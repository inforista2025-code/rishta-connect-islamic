import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * App-wide safety net: if any page crashes at runtime, show a recoverable
 * screen instead of a blank white page the user must refresh.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    // Console keeps the trace for debugging telemetry.
    console.error("App error boundary caught:", _error, _info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
          <h1 className="text-xl font-bold">Kuch dikkat aa gayi hai</h1>
          <p className="text-sm text-muted-foreground max-w-sm">
            Page load karne me samasya aayi hai. Kripya dobara koshish karein ya
            ghar ke page par wapas jayein.
          </p>
          <div className="flex gap-3">
            <Button onClick={() => window.location.reload()}>Refresh</Button>
            <Button variant="outline" onClick={() => (window.location.href = "/")}>
              Home par jayein
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
