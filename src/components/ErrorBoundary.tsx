import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, ShoppingBag } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('KalaKriti UI Error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    try {
      window.location.hash = '';
    } catch {
      // safe
    }
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[50vh] flex items-center justify-center p-6">
          <div className="max-w-md w-full p-8 bg-white border border-[#E6D5C3] rounded-3xl shadow-lg text-center space-y-5">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#F5F1EE] border border-[#E6D5C3] text-[#8B5E34] flex items-center justify-center">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold font-serif text-[#3E2723]">
                Something went wrong
              </h3>
              <p className="text-xs text-[#8C7355] leading-relaxed">
                An unexpected display issue occurred. Your bag, items, and details have been preserved.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#8B5E34] hover:bg-[#734B26] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Try Again
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#FAF9F7] hover:bg-[#F5F1EE] text-[#3E2723] border border-[#E6D5C3] text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#8B5E34]" /> Return to Shop
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
