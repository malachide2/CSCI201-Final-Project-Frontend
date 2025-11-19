import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Mountain } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';

export default function Login() {
  const [searchParams] = useSearchParams();
  const isSignupMode = searchParams.get('signup') === 'true';
  
  const [mode, setMode] = useState<'login' | 'signup'>(isSignupMode ? 'signup' : 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const { login, signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 7) {
      setError('Password must be at least 7 characters long');
      return;
    }

    const success = mode === 'login'
      ? await login(email, password)
      : await signup(username, email, password);

    if (success) {
      navigate('/');
    } else {
      setError(
        mode === 'login'
          ? 'Invalid email or password'
          : 'Email already exists or invalid credentials'
      );
    }
  };

  const handleForgotPassword = () => {
    if (!forgotPasswordEmail) {
      return;
    }
    // Mock forgot password - in production, this would call the backend
    setResetSent(true);
    setTimeout(() => {
      setResetDialogOpen(false);
      setResetSent(false);
      setForgotPasswordEmail('');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Mountain size={40} className="text-green-600" />
            <h1 className="text-3xl font-bold bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Hike Finder
            </h1>
          </div>
          <p className="text-muted-foreground">
            {mode === 'login'
              ? 'Welcome back! Sign in to your account'
              : 'Create an account to start exploring'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1"
              />
            </div>
          )}

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <Label htmlFor="password">Password</Label>
              {mode === 'login' && (
                <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Reset Password</DialogTitle>
                      <DialogDescription>
                        Enter your email address and we'll send you a security code to reset your password.
                      </DialogDescription>
                    </DialogHeader>
                    {!resetSent ? (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="reset-email">Email</Label>
                          <Input
                            id="reset-email"
                            type="email"
                            value={forgotPasswordEmail}
                            onChange={(e) => setForgotPasswordEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="mt-1"
                          />
                        </div>
                        <Button
                          onClick={handleForgotPassword}
                          disabled={!forgotPasswordEmail}
                          className="w-full"
                        >
                          Send Security Code
                        </Button>
                      </div>
                    ) : (
                      <div className="py-4 text-center">
                        <p className="text-green-600 font-semibold">
                          ✓ Security code sent to {forgotPasswordEmail}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Check your email for the reset code
                        </p>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              )}
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={7}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Must be at least 7 characters
            </p>
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <Button type="submit" className="w-full">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setError('');
            }}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {mode === 'login' ? (
              <>
                Don't have an account?{' '}
                <span className="text-primary font-semibold">Sign up</span>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <span className="text-primary font-semibold">Sign in</span>
              </>
            )}
          </button>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-xs font-semibold mb-2">Demo Credentials:</p>
          <p className="text-xs text-muted-foreground">
            Email: trail@example.com
            <br />
            Password: password
          </p>
        </div>
      </Card>
    </div>
  );
}

