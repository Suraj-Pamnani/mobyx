import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "./Button";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    // Send to error tracking service (Sentry, LogRocket, etc.) in production
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4">
          <div className="text-center max-w-md">
            <AlertCircle className="w-16 h-16 text-red-500 dark:text-red-400 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
              Oops! Something went wrong
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              We're sorry for the inconvenience. Please refresh the page or contact support if the problem persists.
            </p>
            {process.env.NODE_ENV === "development" && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 text-left">
                <p className="text-xs font-mono text-red-600 dark:text-red-400 break-words">
                  {this.state.error?.message}
                </p>
              </div>
            )}
            <div className="flex gap-3 justify-center">
              <Button 
                onClick={() => window.location.reload()}
                variant="primary"
              >
                Refresh Page
              </Button>
              <Button 
                onClick={() => window.history.back()}
                variant="secondary"
              >
                Go Back
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
