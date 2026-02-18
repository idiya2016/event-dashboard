import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
}) => {
  const cardClass = `${styles.card} ${hoverable ? styles.hoverable : ''} ${className}`;

  return (
    <div className={cardClass} onClick={onClick} role={onClick ? 'button' : undefined}>
      {children}
    </div>
  );
};

interface CardImageProps {
  src?: string;
  alt: string;
}

export const CardImage: React.FC<CardImageProps> = ({ src, alt }) => {
  const placeholder = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=400&fit=crop';
  const imageUrl = src || placeholder;

  return (
    <div className={styles.cardImage}>
      <img src={imageUrl} alt={alt} />
    </div>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => {
  return <div className={`${styles.cardContent} ${className}`}>{children}</div>;
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => {
  return <div className={`${styles.cardHeader} ${className}`}>{children}</div>;
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => {
  return <div className={`${styles.cardFooter} ${className}`}>{children}</div>;
};
