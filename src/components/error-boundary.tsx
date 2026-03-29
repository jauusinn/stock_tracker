"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
  symbol?: string;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught layout error captured by React Boundary:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      
      return (
        <Card className="w-full h-48 border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/10 flex flex-col justify-center items-center text-center p-4">
          <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
          <h3 className="font-semibold text-red-700 dark:text-red-400">
            {this.props.symbol ? `Widget Failure: ${this.props.symbol}` : "Component Crash"}
          </h3>
          <p className="text-xs text-red-600 dark:text-red-500 mt-1">
            React isolated this error natively.
          </p>
        </Card>
      );
    }

    return this.props.children;
  }
}
