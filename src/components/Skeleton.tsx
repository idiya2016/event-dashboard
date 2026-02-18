import React from 'react';
import styles from './Skeleton.module.css';

interface SkeletonProps {
  variant?: 'text' | 'circle' | 'rect' | 'card' | 'button' | 'input';
  width?: string;
  height?: string;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className = '',
}) => {
  const style = {
    width,
    height,
  };

  return <div className={`${styles.skeleton} ${styles[variant]} ${className}`} style={style} />;
};

interface SkeletonCardProps {
  className?: string;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ className = '' }) => {
  return (
    <div className={`${styles.skeletonCard} ${className}`}>
      <Skeleton variant="rect" className={styles.skeletonImage} />
      <Skeleton className={styles.skeletonTitle} />
      <Skeleton className={styles.skeletonText} />
      <Skeleton className={styles.skeletonText} />
      <Skeleton className={`${styles.skeletonText} ${styles.short}`} />
    </div>
  );
};

interface SkeletonGridProps {
  count?: number;
  className?: string;
}

export const SkeletonGrid: React.FC<SkeletonGridProps> = ({ count = 6, className = '' }) => {
  return (
    <div className={`${styles.skeletonGrid} ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

interface SkeletonListProps {
  count?: number;
  className?: string;
}

export const SkeletonList: React.FC<SkeletonListProps> = ({ count = 5, className = '' }) => {
  return (
    <div className={`${styles.skeletonList} ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.skeletonListItem}>
          <Skeleton variant="circle" className={styles.skeletonCircle} />
          <div className={styles.skeletonContent}>
            <Skeleton className={styles.skeletonTitle} />
            <Skeleton className={styles.skeletonText} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Skeleton;
