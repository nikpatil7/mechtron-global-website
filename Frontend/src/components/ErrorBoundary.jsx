import { Component } from 'react';
import { FaExclamationCircle, FaHome, FaRedo } from 'react-icons/fa';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-secondary via-primary to-[#0a2f47] text-white flex items-center justify-center px-4">
          <div className="max-w-2xl w-full bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/20 shadow-2xl">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/20 rounded-full mb-6">
                <FaExclamationCircle className="text-red-400 text-5xl" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Oops! Something went wrong
              </h1>
              
              <p className="text-lg text-gray-300 mb-8">
                We're sorry for the inconvenience. An unexpected error occurred while processing your request.
              </p>

              {import.meta.env.DEV && this.state.error && (
                <details className="mb-8 text-left bg-black/20 rounded-lg p-4 border border-white/10">
                  <summary className="cursor-pointer font-semibold mb-2 text-accent">
                    Error Details (Development Only)
                  </summary>
                  <pre className="text-xs text-gray-300 overflow-auto max-h-48">
                    {this.state.error.toString()}
                    {'\n\n'}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={this.handleReset}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-all shadow-lg hover:shadow-xl"
                >
                  <FaHome />
                  Go to Homepage
                </button>
                
                <button
                  onClick={this.handleReload}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-all"
                >
                  <FaRedo />
                  Reload Page
                </button>
              </div>

              <div className="mt-8 pt-8 border-t border-white/10">
                <p className="text-sm text-gray-400">
                  If this problem persists, please{' '}
                  <a href="/contact" className="text-accent hover:underline">
                    contact our support team
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
