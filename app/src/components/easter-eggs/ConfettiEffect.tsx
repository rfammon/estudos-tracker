import { useEffect, useState, useCallback, useMemo } from 'react';

interface ConfettiPiece {
    id: number;
    x: number;
    y: number;
    color: string;
    rotation: number;
    scale: number;
    velocityX: number;
    velocityY: number;
    rotationSpeed: number;
    shape: 'square' | 'circle' | 'triangle';
}

interface ConfettiEffectProps {
    duration?: number;
    particleCount?: number;
    colors?: string[];
    onComplete?: () => void;
}

/**
 * ConfettiEffect component - Displays a celebratory confetti animation
 * Used when discovering hidden achievements
 */
const DEFAULT_CONFETTI_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA4', '#DDA0DD', '#98D8C8', '#F7DC6F'];

export function ConfettiEffect({
    duration = 3000,
    particleCount = 100,
    colors = DEFAULT_CONFETTI_COLORS,
    onComplete,
}: ConfettiEffectProps) {
    const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
    const [isActive, setIsActive] = useState(true);

    // Generate confetti pieces
    const generatePieces = useCallback(() => {
        const newPieces: ConfettiPiece[] = [];

        for (let i = 0; i < particleCount; i++) {
            newPieces.push({
                id: i,
                x: Math.random() * 100,
                y: -10 - Math.random() * 20,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                scale: 0.5 + Math.random() * 0.5,
                velocityX: (Math.random() - 0.5) * 3,
                velocityY: 2 + Math.random() * 3,
                rotationSpeed: (Math.random() - 0.5) * 10,
                shape: ['square', 'circle', 'triangle'][Math.floor(Math.random() * 3)] as 'square' | 'circle' | 'triangle',
            });
        }

        return newPieces;
    }, [particleCount, colors]);

    // Initialize pieces
    useEffect(() => {
        setPieces(generatePieces());

        // Set timeout to end animation
        const timeout = setTimeout(() => {
            setIsActive(false);
            if (onComplete) onComplete();
        }, duration);

        return () => clearTimeout(timeout);
    }, [duration, generatePieces, onComplete]);

    // Animate pieces
    useEffect(() => {
        if (!isActive) return;

        const interval = setInterval(() => {
            setPieces((prevPieces) =>
                prevPieces.map((piece) => ({
                    ...piece,
                    x: piece.x + piece.velocityX * 0.1,
                    y: piece.y + piece.velocityY * 0.3,
                    rotation: piece.rotation + piece.rotationSpeed,
                    velocityY: piece.velocityY + 0.1, // gravity
                }))
            );
        }, 16);

        return () => clearInterval(interval);
    }, [isActive]);

    if (!isActive) return null;

    return (
        <div
            className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
            aria-hidden="true"
        >
            {pieces.map((piece) => (
                <div
                    key={piece.id}
                    className="absolute"
                    style={{
                        left: `${piece.x}%`,
                        top: `${piece.y}%`,
                        transform: `rotate(${piece.rotation}deg) scale(${piece.scale})`,
                        width: '10px',
                        height: '10px',
                    }}
                >
                    {piece.shape === 'square' && (
                        <div
                            className="w-full h-full"
                            style={{ backgroundColor: piece.color }}
                        />
                    )}
                    {piece.shape === 'circle' && (
                        <div
                            className="w-full h-full rounded-full"
                            style={{ backgroundColor: piece.color }}
                        />
                    )}
                    {piece.shape === 'triangle' && (
                        <div
                            className="w-0 h-0"
                            style={{
                                borderLeft: '5px solid transparent',
                                borderRight: '5px solid transparent',
                                borderBottom: `10px solid ${piece.color}`,
                            }}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}

/**
 * Hook to trigger confetti effect
 */
export function useConfetti() {
    const [showConfetti, setShowConfetti] = useState(false);
    const [confettiConfig, setConfettiConfig] = useState<{
        duration: number;
        particleCount: number;
        colors: string[];
    }>({
        duration: 3000,
        particleCount: 100,
        colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'],
    });

    const triggerConfetti = useCallback((config?: Partial<typeof confettiConfig>) => {
        if (config) {
            setConfettiConfig((prev) => ({ ...prev, ...config }));
        }
        setShowConfetti(true);
    }, []);

    const hideConfetti = useCallback(() => {
        setShowConfetti(false);
    }, []);

    const ConfettiComponent = useMemo(() => {
        if (!showConfetti) return null;

        return (
            <ConfettiEffect
                duration={confettiConfig.duration}
                particleCount={confettiConfig.particleCount}
                colors={confettiConfig.colors}
                onComplete={hideConfetti}
            />
        );
    }, [showConfetti, confettiConfig, hideConfetti]);

    return {
        triggerConfetti,
        showConfetti,
        ConfettiComponent,
    };
}

/**
 * Small confetti burst for smaller celebrations
 */
export function ConfettiBurst({ x, y }: { x: number; y: number }) {
    const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

    useEffect(() => {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFEAA7'];
        const newPieces: ConfettiPiece[] = [];

        for (let i = 0; i < 20; i++) {
            newPieces.push({
                id: i,
                x: 0,
                y: 0,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                scale: 0.3 + Math.random() * 0.3,
                velocityX: (Math.random() - 0.5) * 10,
                velocityY: -5 - Math.random() * 5,
                rotationSpeed: (Math.random() - 0.5) * 20,
                shape: 'circle',
            });
        }

        setPieces(newPieces);

        const interval = setInterval(() => {
            setPieces((prevPieces) =>
                prevPieces.map((piece) => ({
                    ...piece,
                    x: piece.x + piece.velocityX * 0.1,
                    y: piece.y + piece.velocityY * 0.3,
                    rotation: piece.rotation + piece.rotationSpeed,
                    velocityY: piece.velocityY + 0.5,
                }))
            );
        }, 16);

        const timeout = setTimeout(() => {
            clearInterval(interval);
            setPieces([]);
        }, 1000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, []);

    if (pieces.length === 0) return null;

    return (
        <div
            className="fixed pointer-events-none z-50"
            style={{ left: x, top: y }}
            aria-hidden="true"
        >
            {pieces.map((piece) => (
                <div
                    key={piece.id}
                    className="absolute rounded-full"
                    style={{
                        left: piece.x,
                        top: piece.y,
                        width: '8px',
                        height: '8px',
                        backgroundColor: piece.color,
                        transform: `rotate(${piece.rotation}deg) scale(${piece.scale})`,
                    }}
                />
            ))}
        </div>
    );
}

export default ConfettiEffect;
