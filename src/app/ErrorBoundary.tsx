import { Component, type ReactNode } from "react";

export default class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <main role="alert" className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md rounded-xl border bg-white p-8 space-y-4">
        <h1 className="text-xl font-semibold">We couldn't display this page</h1>
        <p>Please reload to try again. Unsaved changes may need to be entered again.</p>
        <button className="rounded-lg bg-blue-600 px-4 py-2 text-white" onClick={() => window.location.reload()}>Reload page</button>
      </div>
    </main>;
    return this.props.children;
  }
}
