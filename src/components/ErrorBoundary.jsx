import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // 🔒 Log only in production tools (Sentry, LogRocket, etc.)
    console.error("UI Error:", error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <p className="text-lg font-semibold">
            Something went wrong.
          </p>
          <button
            onClick={this.handleReload}
            className="
              px-4 py-2 rounded-lg
              bg-accent text-black font-medium
              hover:opacity-90
            "
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
