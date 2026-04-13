import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * 全局错误边界组件
 * 捕获子组件树中的 JavaScript 错误，防止整个应用崩溃
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleRestart = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>出错了</Text>
          <Text style={styles.message}>应用遇到了一个问题</Text>
          <Text style={styles.errorText}>
            {this.state.error?.message || '未知错误'}
          </Text>
          <TouchableOpacity style={styles.button} onPress={this.handleRestart}>
            <Text style={styles.buttonText}>重试</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4FC3F7',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  errorText: {
    fontSize: 14,
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#4FC3F7',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#1a1a2e',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ErrorBoundary;
