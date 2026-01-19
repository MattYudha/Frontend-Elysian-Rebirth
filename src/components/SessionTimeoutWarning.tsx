'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useEffect, useState, useCallback } from 'react';
import { Clock } from 'lucide-react';

const TOKEN_EXPIRY_KEY = 'token_expiry';
const WARNING_TIME = 2 * 60 * 1000; // 2 minutes before expiry

export function SessionTimeoutWarning() {
    const [showWarning, setShowWarning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);

    const checkExpiry = useCallback(() => {
        const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
        if (!expiry) return;

        const expiryTime = parseInt(expiry, 10);
        const now = Date.now();
        const timeUntilExpiry = expiryTime - now;

        if (timeUntilExpiry <= WARNING_TIME && timeUntilExpiry > 0) {
            setTimeLeft(Math.floor(timeUntilExpiry / 1000));
            setShowWarning(true);
        } else {
            setShowWarning(false);
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(checkExpiry, 10 * 1000); // Check every 10 seconds
        return () => clearInterval(interval);
    }, [checkExpiry]);

    const handleKeepAlive = () => {
        // Extend session by updating expiry
        const newExpiry = Date.now() + 60 * 60 * 1000; // 1 hour
        localStorage.setItem(TOKEN_EXPIRY_KEY, newExpiry.toString());
        setShowWarning(false);
    };

    return (
        <Dialog open={showWarning} onOpenChange={setShowWarning}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Session Expiring Soon
                    </DialogTitle>
                    <DialogDescription className="space-y-2">
                        <p>Your session will expire in {Math.floor(timeLeft / 60)} minutes and {timeLeft % 60} seconds.</p>
                        <p>Click &quot;Keep me logged in&quot; to extend your session.</p>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setShowWarning(false)}>
                        Logout
                    </Button>
                    <Button onClick={handleKeepAlive}>
                        Keep me logged in
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
